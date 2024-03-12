CREATE (`101`:person {country:"United States", name:["Alice","Carol"]})
CREATE (`102`:person:student {country:"Japan", name:"Bob"})
CREATE (`101`)-[:likes {engaged:false, since:2015}]->(`102`)
