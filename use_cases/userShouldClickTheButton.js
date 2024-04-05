export default function (testBuilder) { 
    return testBuilder
    .check({ target: "#count", is:"0" })
    .click({ target: "#button" })
    .check({ target: "#count", is:"1" })
}