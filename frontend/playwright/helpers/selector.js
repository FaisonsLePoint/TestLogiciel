export const selector = (page, elem) => {
    if(/\s/.test(elem)){
        const [parent, child] = elem.split(' ')
        return page.locator(`[data-cy=${parent}] ${child}`)
    }
    return page.locator(`[data-cy=${elem}]`)
}