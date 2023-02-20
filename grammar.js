/* eslint-disable arrow-parens */
/* eslint-disable camelcase */
/* eslint-disable-next-line spaced-comment */
/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: 'ungrammar',

  extras: $ => [
    $.comment,
    /\s/,
  ],

  conflicts: $ => [
    [$.sequence],
  ],

  word: $ => $.identifier,

  rules: {
    grammar: $ => repeat($.node),

    node: $ => seq(alias($.identifier, $.definition), '=', $.rule),

    rule: $ => $.alternation,

    _atom_rule: $ => choice(
      $.node_rule,
      $.token,
      $.label,
      seq('(', $.rule, ')'),
      $.repetition,
      $.optional,
    ),

    repetition: $ => seq($._atom_rule, '*'),

    optional: $ => seq($._atom_rule, '?'),

    node_rule: $ => $.identifier,

    token: $ => seq('\'', $.token_identifier, '\''),

    label: $ => prec.left(1,
      seq(alias($.identifier, $.label_name), ':', $._atom_rule),
    ),

    sequence: $ => repeat1($._atom_rule),

    alternation: $ => seq($.sequence, repeat(seq('|', $.sequence))),

    identifier: _ => /[a-zA-Z_]+/,
    token_identifier: _ => /(?:[^'\\]|\\\\|\\')+/,

    comment: _ => token(seq('//', /.*/)),
  },
});
