'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactCustomScrollbars = require('react-custom-scrollbars');

var _rebound = require('rebound');

var _draftJs = require('draft-js');

var _BasicEditor = require('../BasicEditor/BasicEditor');

var _BasicEditor2 = _interopRequireDefault(_BasicEditor);

var _NoteContainer = require('../NoteContainer/NoteContainer');

var _NoteContainer2 = _interopRequireDefault(_NoteContainer);

require('./Editor.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This module exports a component representing an editor with main editor and footnotes,
 * with related interface and decorators.
 * Asset components must be provided through props
 * @module scholar-draft/Editor
 */

var Editor = function (_Component) {
  (0, _inherits3.default)(Editor, _Component);

  /**
   * component contructor
   * @param {object} props - initializing props
   */
  function Editor(props) {
    (0, _classCallCheck3.default)(this, Editor);

    // this is used as a map of refs 
    // to interact with note components
    var _this = (0, _possibleConstructorReturn3.default)(this, (Editor.__proto__ || (0, _getPrototypeOf2.default)(Editor)).call(this, props));

    _this.componentDidMount = function () {

      // we use a spring system to handle automatic scrolls
      // (e.g. note pointer clicked or click in the table of contents)
      _this.springSystem = new _rebound.SpringSystem();
      _this.spring = _this.springSystem.createSpring();
      _this.spring.addListener({
        onSpringUpdate: _this.handleSpringUpdate
      });
    };

    _this.handleSpringUpdate = function (spring) {
      var val = spring.getCurrentValue();
      if (val !== undefined && _this.globalScrollbar) {
        _this.globalScrollbar.scrollTop(val);
      }
    };

    _this.focus = function (contentId, selection) {
      if (contentId === 'main' && _this.mainEditor) {
        if (selection) {
          _this.mainEditor.setState({
            readOnly: false,
            editorState: _draftJs.EditorState.acceptSelection(_this.mainEditor.state.editorState, selection)
          });
        }
        setTimeout(function () {
          return _this.mainEditor.focus();
        });
      } else if (_this.notes[contentId]) {
        setTimeout(function () {
          return _this.notes[contentId].editor.focus();
        });
        if (selection) {
          _this.notes[contentId].editor.setState({
            readOnly: false,
            editorState: _draftJs.EditorState.acceptSelection(_this.notes[contentId].editor.state.editorState, selection)
          });
        }
      }
    };

    _this.generateEmptyEditor = function () {
      if (_this.mainEditor) {
        return _this.mainEditor.generateEmptyEditor();
      }
      return null;
    };

    _this.renderNoteEditor = function (noteId, order) {
      var _this$props = _this.props,
          notes = _this$props.notes,
          assets = _this$props.assets,
          onEditorChange = _this$props.onEditorChange,
          onAssetChange = _this$props.onAssetChange,
          onAssetRequest = _this$props.onAssetRequest,
          onAssetRequestCancel = _this$props.onAssetRequestCancel,
          onAssetChoice = _this$props.onAssetChoice,
          onAssetClick = _this$props.onAssetClick,
          onAssetMouseOver = _this$props.onAssetMouseOver,
          onAssetMouseOut = _this$props.onAssetMouseOut,
          onNoteDelete = _this$props.onNoteDelete,
          onDrop = _this$props.onDrop,
          onDragOver = _this$props.onDragOver,
          onClick = _this$props.onClick,
          onBlur = _this$props.onBlur,
          assetRequestPosition = _this$props.assetRequestPosition,
          assetChoiceProps = _this$props.assetChoiceProps,
          inlineAssetComponents = _this$props.inlineAssetComponents,
          blockAssetComponents = _this$props.blockAssetComponents,
          AssetChoiceComponent = _this$props.AssetChoiceComponent,
          inlineEntities = _this$props.inlineEntities,
          iconMap = _this$props.iconMap,
          keyBindingFn = _this$props.keyBindingFn,
          editorStyles = _this$props.editorStyles,
          clipboard = _this$props.clipboard,
          focusedEditorId = _this$props.focusedEditorId,
          NoteContainerComponent = _this$props.NoteContainerComponent,
          renderingMode = _this$props.renderingMode;

      var onThisNoteEditorChange = function onThisNoteEditorChange(editor) {
        return onEditorChange(noteId, editor);
      };
      var onNoteAssetRequest = function onNoteAssetRequest(selection) {
        onAssetRequest(noteId, selection);
      };
      var onClickDelete = function onClickDelete() {
        if (typeof onNoteDelete === 'function') {
          _this.props.onNoteDelete(noteId);
        }
      };
      var onNoteDrop = function onNoteDrop(payload, selection) {
        if (typeof onDrop === 'function') {
          onDrop(noteId, payload, selection);
        }
      };
      var onNoteDragOver = function onNoteDragOver(event) {
        if (typeof onDragOver === 'function') {
          onDragOver(noteId, event);
        }
      };
      var note = notes[noteId];

      var onNoteEditorClick = function onNoteEditorClick(event) {
        if (typeof onClick === 'function') {
          onClick(event, noteId);
        }
      };
      var bindNote = function bindNote(thatNote) {
        _this.notes[noteId] = thatNote;
      };
      var onNoteBlur = function onNoteBlur(event) {
        onBlur(event, noteId);
      };

      var onClickScrollToNotePointer = function onClickScrollToNotePointer(thatNoteId) {
        var notePointer = document.getElementById('note-pointer-' + thatNoteId);
        var scrollTo = notePointer && notePointer.offsetTop;
        if (scrollTo) {
          _this.scrollTop(scrollTo);
        }
      };

      var NoteContainer = NoteContainerComponent || _NoteContainer2.default;
      return _react2.default.createElement(NoteContainer, {
        key: noteId,
        note: note,
        notes: notes,
        assets: assets,

        ref: bindNote,

        contentId: noteId,

        assetRequestPosition: assetRequestPosition,
        assetChoiceProps: assetChoiceProps,

        isActive: noteId === focusedEditorId,

        onEditorClick: onNoteEditorClick,
        onBlur: onNoteBlur,

        renderingMode: renderingMode,

        onEditorChange: onThisNoteEditorChange,

        onClickScrollToNotePointer: onClickScrollToNotePointer,

        onAssetRequest: onNoteAssetRequest,
        onAssetRequestCancel: onAssetRequestCancel,
        onAssetChange: onAssetChange,
        onAssetChoice: onAssetChoice,

        clipboard: clipboard,

        onDrop: onNoteDrop,
        onDragOver: onNoteDragOver,
        onClickDelete: onClickDelete,

        onAssetClick: onAssetClick,
        onAssetMouseOver: onAssetMouseOver,
        onAssetMouseOut: onAssetMouseOut,

        inlineAssetComponents: inlineAssetComponents,
        blockAssetComponents: blockAssetComponents,
        AssetChoiceComponent: AssetChoiceComponent,
        inlineEntities: inlineEntities,
        iconMap: iconMap,
        keyBindingFn: keyBindingFn,

        editorStyle: editorStyles && editorStyles.noteEditor
      });
    };

    _this.notes = {};
    return _this;
  }

  /**
   * Executes code on instance after the component is mounted
   */


  /**
   * Handles the scrolling process using the spring system
   * @param {object} spring - the spring system instance
   */


  (0, _createClass3.default)(Editor, [{
    key: 'scrollTop',


    /**
     * Programmatically modifies the scroll state of the component
     * so that it transitions to a specific point in the page
     * @param {number} top - the position to scroll to in pixels
     */
    value: function scrollTop(top) {
      // this.globalScrollbar.scrollTop(top);
      var scrollbars = this.globalScrollbar;
      var scrollTop = scrollbars.getScrollTop();
      var scrollHeight = scrollbars.getScrollHeight();
      var val = _rebound.MathUtil.mapValueInRange(top, 0, scrollHeight, 0, scrollHeight);
      this.spring.setCurrentValue(scrollTop).setAtRest();
      this.spring.setEndValue(val);
    }

    /**
     * manages imperative focus on one of the editors
     * @param {string} contentId - 'main' or note uuid
     * @param {ImmutableRecord} selection - the selection to focus on
     */


    /**
     * Provides upstream-usable empty editor factory method with proper decorator
     * @return {ImmutableRecord} editorState - output editor state
     */


    /**
     * Renders a note editor component for a specific note
     * @param {string} noteId - uuid of the note to render
     * @param {number} order - order to attribute to it
     * @return {ReactMarkup} noteComponent - the note component
     */

  }, {
    key: 'render',


    /**
     * Renders the component
     * @return {ReactMarkup} component - the output component
     */
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          mainEditorState = _props.mainEditorState,
          notes = _props.notes,
          assets = _props.assets,
          _props$editorClass = _props.editorClass,
          editorClass = _props$editorClass === undefined ? 'scholar-draft-Editor' : _props$editorClass,
          onEditorChange = _props.onEditorChange,
          onNoteAdd = _props.onNoteAdd,
          onAssetChange = _props.onAssetChange,
          onAssetRequest = _props.onAssetRequest,
          onAssetRequestCancel = _props.onAssetRequestCancel,
          onAssetChoice = _props.onAssetChoice,
          onAssetClick = _props.onAssetClick,
          onAssetMouseOver = _props.onAssetMouseOver,
          onAssetMouseOut = _props.onAssetMouseOut,
          onNotePointerMouseOver = _props.onNotePointerMouseOver,
          onNotePointerMouseOut = _props.onNotePointerMouseOut,
          onNotePointerMouseClick = _props.onNotePointerMouseClick,
          onDrop = _props.onDrop,
          onDragOver = _props.onDragOver,
          onClick = _props.onClick,
          onBlur = _props.onBlur,
          assetRequestPosition = _props.assetRequestPosition,
          assetChoiceProps = _props.assetChoiceProps,
          inlineAssetComponents = _props.inlineAssetComponents,
          blockAssetComponents = _props.blockAssetComponents,
          AssetChoiceComponent = _props.AssetChoiceComponent,
          NotePointerComponent = _props.NotePointerComponent,
          BibliographyComponent = _props.BibliographyComponent,
          _props$inlineEntities = _props.inlineEntities,
          inlineEntities = _props$inlineEntities === undefined ? [] : _props$inlineEntities,
          iconMap = _props.iconMap,
          editorStyles = _props.editorStyles,
          clipboard = _props.clipboard,
          focusedEditorId = _props.focusedEditorId,
          renderingMode = _props.renderingMode;

      /**
       * bindings
       */

      var bindMainEditor = function bindMainEditor(editor) {
        _this2.mainEditor = editor;
      };

      /**
       * callbacks
       */
      var onMainEditorChange = function onMainEditorChange(editor) {
        return onEditorChange('main', editor);
      };
      var onMainAssetRequest = function onMainAssetRequest(selection) {
        onAssetRequest('main', selection);
      };
      var onMainEditorDrop = function onMainEditorDrop(payload, selection) {
        if (typeof onDrop === 'function') {
          onDrop('main', payload, selection);
        }
      };

      var onMainDragOver = function onMainDragOver(event) {
        if (typeof onDragOver === 'function') {
          onDragOver('main', event);
        }
      };

      var onMainEditorClick = function onMainEditorClick(event) {
        if (typeof onClick === 'function') {
          onClick(event, 'main');
        }
      };
      var onMainBlur = function onMainBlur(event) {
        onBlur(event, 'main');
      };

      var onNotePointerMouseClickHandler = function onNotePointerMouseClickHandler(event) {
        var noteContainer = document.getElementById('note-container-' + event);
        if (noteContainer) {
          var offsetTop = noteContainer.offsetTop;
          _this2.scrollTop(offsetTop);
        }
        if (typeof onNotePointerMouseClick === 'function') {
          onNotePointerMouseClick(event, 'main');
        }
      };

      var bindGlobalScrollbarRef = function bindGlobalScrollbarRef(scrollbar) {
        _this2.globalScrollbar = scrollbar;
      };
      return _react2.default.createElement(
        'div',
        { className: editorClass },
        _react2.default.createElement(
          _reactCustomScrollbars.Scrollbars,
          {
            ref: bindGlobalScrollbarRef,
            autoHide: true,
            onUpdate: this.onScrollUpdate,
            universal: true
          },
          _react2.default.createElement(
            'section',
            { className: 'main-container-editor' },
            _react2.default.createElement(_BasicEditor2.default, {
              editorState: mainEditorState,
              assets: assets,
              ref: bindMainEditor,

              notes: notes,

              contentId: 'main',

              assetRequestPosition: assetRequestPosition,
              assetChoiceProps: assetChoiceProps,

              isActive: focusedEditorId === 'main',

              onClick: onMainEditorClick,
              onBlur: onMainBlur,

              renderingMode: renderingMode,

              onEditorChange: onMainEditorChange,
              onDragOver: onMainDragOver,
              onDrop: onMainEditorDrop,
              onAssetRequest: onMainAssetRequest,
              onAssetRequestCancel: onAssetRequestCancel,
              onAssetChoice: onAssetChoice,

              onNoteAdd: onNoteAdd,
              onAssetChange: onAssetChange,

              onAssetClick: onAssetClick,
              onAssetMouseOver: onAssetMouseOver,
              onAssetMouseOut: onAssetMouseOut,

              onNotePointerMouseOver: onNotePointerMouseOver,
              onNotePointerMouseOut: onNotePointerMouseOut,
              onNotePointerMouseClick: onNotePointerMouseClickHandler,

              inlineAssetComponents: inlineAssetComponents,
              blockAssetComponents: blockAssetComponents,
              AssetChoiceComponent: AssetChoiceComponent,
              NotePointerComponent: NotePointerComponent,
              inlineEntities: inlineEntities,
              iconMap: iconMap,

              clipboard: clipboard,

              allowNotesInsertion: true,
              editorStyle: editorStyles && editorStyles.mainEditor
            })
          ),
          _react2.default.createElement(
            'aside',
            { className: 'notes-container' },
            (0, _keys2.default)(notes || {}).sort(function (first, second) {
              if (notes[first].order > notes[second].order) {
                return 1;
              }return -1;
            }).map(this.renderNoteEditor)
          ),
          BibliographyComponent && _react2.default.createElement(BibliographyComponent, null)
        )
      );
    }
  }]);
  return Editor;
}(_react.Component);

Editor.propTypes = {
  mainEditorState: _propTypes2.default.object,
  notes: _propTypes2.default.object,
  assets: _propTypes2.default.object,

  editorClass: _propTypes2.default.string,

  onEditorChange: _propTypes2.default.func,
  onNoteAdd: _propTypes2.default.func,

  onAssetChange: _propTypes2.default.func,
  onAssetRequest: _propTypes2.default.func,
  onAssetRequestCancel: _propTypes2.default.func,
  onAssetChoice: _propTypes2.default.func,
  onAssetClick: _propTypes2.default.func,
  onAssetMouseOver: _propTypes2.default.func,
  onAssetMouseOut: _propTypes2.default.func,

  onNotePointerMouseOver: _propTypes2.default.func,
  onNotePointerMouseOut: _propTypes2.default.func,
  onNotePointerMouseClick: _propTypes2.default.func,
  onNoteDelete: _propTypes2.default.func,
  onDrop: _propTypes2.default.func,
  onDragOver: _propTypes2.default.func,
  onClick: _propTypes2.default.func,
  onBlur: _propTypes2.default.func,

  assetRequestPosition: _propTypes2.default.object,
  assetChoiceProps: _propTypes2.default.object,

  inlineAssetComponents: _propTypes2.default.object,
  blockAssetComponents: _propTypes2.default.object,
  AssetChoiceComponent: _propTypes2.default.func,
  NotePointerComponent: _propTypes2.default.func,
  BibliographyComponent: _propTypes2.default.func,
  inlineEntities: _propTypes2.default.array,
  iconMap: _propTypes2.default.object,

  renderingMode: _propTypes2.default.string,

  keyBindingFn: _propTypes2.default.func,

  editorStyles: _propTypes2.default.object,
  clipboard: _propTypes2.default.object,
  focusedEditorId: _propTypes2.default.string,
  NoteContainerComponent: _propTypes2.default.func };
exports.default = Editor;
module.exports = exports['default'];