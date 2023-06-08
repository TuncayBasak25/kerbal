global function camelCase {
    parameter text.

    if (text = "") {
        return text.
    }

    return text[0]:toUpper() + text:remove(0, 1).
}