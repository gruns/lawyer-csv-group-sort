const cl = console.log

const $btn = document.getElementById('submit')
const $input = document.getElementById('input')
const $output = document.getElementById('output')

function enquote (s) {
    return '"' + s + '"'
}

function unquote (s) {
    if (s.length >= 2 && (
        (s[0] === '"' && s[s.length - 1] === '"') ||
        (s[0] === "'" && s[s.length - 1] === "'")))
        return s.slice(1, -1)
    return s
}

function groupContainsValue(group, person, column) {
    for (const member of group) {
        //cl('person[column]', person[column], 'member[column]', member[column])
        if (person[column] === member[column]) {
            return true
        }
    }
    return false
}

// https://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function sortIntoGroups () {
    const groupSize = parseInt(document.getElementById('group-size').value)

    const lines = $input.value.split('\n')
    const numGroups = Math.ceil(lines.length / groupSize)

    const groups = []
    for (let i = 0; i < numGroups; i++) {
        groups[i] = []
    }

    function addPersonToFirstOpenGroup (person) {
        for (const group of groups) {
            if (group.length < groupSize) {
                group.push(person)
                break
            }
        }
    }

    function addPersonToFirstUniqueGroup (person, column) {
        for (const group of groups) {
            if (!groupContainsValue(group, person, column)
                && group.length < groupSize) {
                group.push(person)
                return true
            }
        }

        return false
    }

    const randomizedLines = []
    for (const line of lines) {
        if (!line.replace(/\s/g, '').length) { // whitespace
            continue
        }
        randomizedLines.push(line)
    }
    shuffle(randomizedLines)

    for (const line of randomizedLines) {
        // lastName, firstName, school, interest, startDate
        let person = line.split(',').map(unquote)
        if (person.length !== 5) {
            person = line.split('\t').map(unquote)
        }

        const addedBySchool = addPersonToFirstUniqueGroup(person, 2)
        if (!addedBySchool) {
            const addedByInterest = addPersonToFirstUniqueGroup(person, 3)
            if (!addedByInterest) {
                addPersonToFirstOpenGroup(person)
            }
        }
    }

    let output = []
    for (const group of groups) {
        for (const member of group) {
            output.push(member.map(enquote).join(','))
        }
        output.push('\n')
    }
    $output.value = output.join('\n')
}

$btn.addEventListener('click', sortIntoGroups)


