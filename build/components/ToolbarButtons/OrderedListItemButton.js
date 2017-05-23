'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactSvgInline = require('react-svg-inline');

var _reactSvgInline2 = _interopRequireDefault(_reactSvgInline);

var _BlockButton = require('./BlockButton');

var _BlockButton2 = _interopRequireDefault(_BlockButton);

var _orderedlist = require('../../icons/orderedlist.svg');

var _orderedlist2 = _interopRequireDefault(_orderedlist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (props) {
  return _react2.default.createElement(
    _BlockButton2.default,
    (0, _extends3.default)({}, props, { blockType: 'ordered-list-item', className: 'DraftJsEditor-ordered-list-item' }),
    _react2.default.createElement(_reactSvgInline2.default, {
      svg: _orderedlist2.default
    })
  );
};

module.exports = exports['default'];