export default function (testBuilder) { 
    return testBuilder
   // .check({ url: "/" })
    .check({ target: "#title", is:"Hello Medium!" })
    .click({ target: "#about" })
    .check({ url: "/about" })
    .check({ target: "#title", is:"About Us" })
    .click({ target:"a", has: "to Home" })
   // .check({ url: "/" })
   // .check({ target: "#title", is:"Hello Medium!" })
}