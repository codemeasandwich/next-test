export default function (testBuilder) { 
    return testBuilder
    .check({ target: "#title", has:"Hello Medium!" })
}