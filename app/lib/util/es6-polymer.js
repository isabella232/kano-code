function html(strings, ...values) {
    let templateHTML = strings.reduce((str, string, i) => {
        return str + string + (values[i] || '');
    }, '<template>');
    templateHTML += '</template>';
    const f = document.createElement('dom-module');
    f.innerHTML = templateHTML;
    return f;
}

function registerDomModule(ElClass) {
    const d = ElClass.tpl;
    const id = ElClass.is;
    d.setAttribute('id', id);
    document.body.appendChild(d);
}

export { registerDomModule, html };
