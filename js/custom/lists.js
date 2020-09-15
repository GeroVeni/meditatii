function makeItem (template, map) {
    let newItem = document.createElement("DIV");
    template.match(/{.*?}/g).forEach(function (value) {
        template = template.replace(value, map[value.slice(1, -1)]);
    });
    newItem.innerHTML = template;
    return newItem.firstChild;
}

