// src/render.js
// tokens -> text. Applies the `case` and `charset` options to every token, so
// `text` is always exactly the tokens read in order.

function transform(value, letterCase, charset) {
  let out = letterCase === 'upper' ? value.toUpperCase() : value;
  if (charset === 'alpha') {
    // A-Z and space only: drops the comma in the verbose joiner
    out = out.replace(/[^A-Za-z ]/g, '').replace(/ +/g, ' ').trim();
  }
  return out;
}

export function render(tokens, { case: letterCase, charset }) {
  const out = tokens
    .map((t) => ({ type: t.type, value: transform(t.value, letterCase, charset) }))
    .filter((t) => t.value !== '');

  // Space-separated, except a token that opens with a comma attaches to the one before it.
  const text = out.reduce(
    (acc, t, i) => acc + (i === 0 || t.value.startsWith(',') ? '' : ' ') + t.value,
    ''
  );
  return { text, tokens: out };
}
