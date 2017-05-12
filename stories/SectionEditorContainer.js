import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {mapSeries} from 'async';
import {
  EditorState,
  Modifier,
  Entity,
  AtomicBlockUtils
} from 'draft-js';

import {
  v4 as generateId
} from 'uuid';

import {
  SectionEditor,
  utils
} from '../src';

const {
  getContextualizationsToDeleteFromEditor,
  insertContextualizationInEditor,
  deleteContextualizationFromEditor,
  deleteNoteFromEditor,
  getUnusedContextualizations,
  updateNotesFromEditor,
  insertNoteInEditor
} = utils;

// import SectionEditor from '../src/SectionEditor';
// import {
//   getContextualizationsToDeleteFromEditor,
//   insertContextualizationInEditor,
//   deleteContextualizationFromEditor,
//   deleteNoteFromEditor,
//   getUnusedContextualizations,
//   updateNotesFromEditor,
//   insertNoteInEditor
// } from '../src/utils';

import BlockContainer from './ExampleContextualizationBlock';
import InlinePointer from './ExampleInlinePointer';

const inlineContextualizationComponents = {
  citation: InlinePointer
};

const blockContextualizationComponents = {
  citation: BlockContainer
};

export default class ContentEditorContainer extends Component {
  
  state = {
    // mock related
    contextualizationRequest: false,
    contextualizationRequestType: undefined,
    // all these should be handled by upstream logic in real applications
    mainEditorState: undefined,
    notes: {},
    inlineContextualizationComponents,
    blockContextualizationComponents,
    contextualizations: {
    },
    resources: {
      [generateId()]: {
        title: 'My nice resource',
        authors: [
          {
            firstName: 'Mickey',
            lastName: 'Rourque'
          }
        ]
      }
    },
    contextualizers: {
      [generateId()]: {
        type: 'citation',
        pages: '12-13'
      }
    }
  }


  constructor(props) {
    super(props);
  }

  onEditorChange = (contentType, noteId, editorState) => {
    if (contentType === 'main') {
      const notes = updateNotesFromEditor(editorState, this.state.notes);
      this.setState({
        mainEditorState: editorState,
        notes
      });
    } else {
      this.setState({
        notes: {
            ...this.state.notes,
            [noteId]: {
              ...this.state.notes[noteId],
              editorState
            }
          }
      });
    }
  }

  onContextualizationRequest = (contentType, noteId, contextualizationRequestType, selection) => {
    this.setState({
      contextualizationRequestType,
      contextualizationRequest: true,
      contextualizationRequestSelection: selection,
      contextualizationRequestContentId: contentType === 'main' ? 'main' : noteId
    });
  }

  /*
   * MOCK-RELATED
   */

  onContextualizationMouseClick = (contextualizationId, contextualizationData, event) => {
    console.info('on contextualization mouse click', contextualizationId, contextualizationData, event);
  }

  onContextualizationMouseOver = (contextualizationId, contextualizationData, event) => {
    console.info('on contextualization mouse over', contextualizationId, contextualizationData, event);
  }

  onContextualizationMouseOut = (contextualizationId, contextualizationData, event) => {
    console.info('on contextualization mouse out', contextualizationId, contextualizationData, event);
  }

  onNotePointerMouseOver = (noteId, event) => {
    console.info('on note pointer mouse over', noteId, event);
  }

  onNotePointerMouseOut = (noteId, event) => {
    console.info('on note pointer mouse out', noteId, event);
  }

  onNotePointerMouseClick = (noteId, event) => {
    console.info('on note pointer mouse click', noteId, event);
  }

  insertContextualization = (contentId, inputEditorState) => {
    const {
      mainEditorState,
      notes,
      contextualizationRequestType,
      contextualizationRequestSelection,
      // contextualizationRequestContentId,
      resources,
      contextualizers,
      contextualizations
    } = this.state;

    const contextualizationRequestContentId = contentId || this.state.contextualizationRequestContentId;
    const id = generateId();
    const contextualization = {
      id,
      resourceId: Object.keys(resources)[0],
      contextualizerId: Object.keys(contextualizers)[0],
      type: contextualizers[Object.keys(contextualizers)[0]].type,
    };
    let editorState = inputEditorState;
    if (!editorState){
      editorState = contextualizationRequestContentId === 'main' ? mainEditorState : notes[contextualizationRequestContentId].editorState;
    }
    const newEditorState = insertContextualizationInEditor(editorState, contextualization);
    const newState = {
      lastInsertionType: this.state.contextualizationRequestType,
      contextualizationRequest: false,
      contextualizationRequestType: undefined,
      contextualizationRequestSelection: undefined,
      contextualizations: {
        ...contextualizations,
        [id]: contextualization
      },
      notes: this.state.notes
      // editorState: newEditorState,
    };
    if (contextualizationRequestContentId === 'main') {
      newState.mainEditorState = newEditorState;
    } else {
      newState.notes[contextualizationRequestContentId].editorState = newEditorState;
    }
    this.setState(newState);
  }

  updateResourceTitle = title => {
    this.setState({
      resources: {
        ...this.state.resources,
        [Object.keys(this.state.resources)[0]] : {
          ...this.state.resources[Object.keys(this.state.resources)[0]],
          title 
        }
      }
    })
  }

  updateContextualizerPages = pages => {
    this.setState({
      contextualizers: {
        ...this.state.contextualizers,
        [Object.keys(this.state.contextualizers)[0]] : {
          ...this.state.contextualizers[Object.keys(this.state.contextualizers)[0]],
          pages
        }
      }
    })
  }

  onDataChange = (dataProp, id, newObject) => {
    this.setState({
      [dataProp]: {
        ...this.state[dataProp],
        [id]: newObject
      }
    });
  }

  deleteContextualizations = ids => {
    const contextualizations = {...this.state.contextualizations};
    ids.forEach(id => {
      delete contextualizations[id]
    });
    return contextualizations;
  }

  deleteContextualization = (id) => {
    const contextualizations = {...this.state.contextualizations};
    const notes = this.state.notes;
    deleteContextualizationFromEditor(this.state.mainEditorState, ['inlineContextualization', 'blockContextualization'], id, newEditorState => {
      mapSeries(notes, (note, cb) => {
        deleteContextualizationFromEditor(note.editorState, ['inlineContextualization', 'blockContextualization'], id, newNoteEditorState => {
          cb(null, {
            ...note,
            editorState: newNoteEditorState
          });
        });
      }, (err, finalNotes) => {
        delete contextualizations[id];
        this.setState({
          mainEditorState: newEditorState,
          notes: finalNotes,
          contextualizations
        });
      });
    });
  }

  /**
   * Deletes from state contextualizations not used inside the editor
   */
  refreshContextualizationsList = () => {
    // in main
    let unused = getUnusedContextualizations(this.state.mainEditorState, this.state.contextualizations);
    const contextualizations = {...this.state.contextualizations};
    unused.forEach(id => {
      delete contextualizations[id];
    });
    // in notes
    Object.keys(this.state.notes)
    .forEach(noteId => {
      const noteEditor = this.state.notes[noteId].editorState;
      unused = getUnusedContextualizations(noteEditor, this.state.contextualizations);
      unused.forEach(id => {
        delete contextualizations[id];
      });
    })
    this.setState({
      contextualizations
    });
  }

  addNote = () => {
    const id = generateId();
    // add related entity in main editor
    const mainEditorState = insertNoteInEditor(this.state.mainEditorState, id);
    // add note
    const notes = {
      ...this.state.notes,
      [id]: {
        id,
        editorState: undefined
      }
    };
    this.setState({
      notes,
      mainEditorState
    });
  }

  deleteNote = id => {
    // remove related entity in main editor
    deleteNoteFromEditor(this.state.mainEditorState, id, mainEditorState => {
      // remove note
      const notes = this.state.notes;
      delete notes[id];
      this.setState({
        mainEditorState,
        notes
      });
    });
  }

  render = () => {
    
    const {
      onEditorChange,
      onContextualizationRequest,

      onContextualizationClick,
      onContextualizationMouseOver,
      onContextualizationMouseOut,

      onNotePointerMouseOver,
      onNotePointerMouseOut,
      onNotePointerMouseClick,

      insertContextualization,
      updateContextualizerPages,
      updateResourceTitle,
      onDataChange,
      deleteContextualization,
      refreshContextualizationsList,
      addNote,
      deleteNote,
      state
    } = this;
    const {
      mainEditorState,
      notes,
      inlineContextualizationComponents,
      blockContextualizationComponents,
      contextualizations,
      contextualizers,
      contextualizationRequest,
      resources,
      lastInsertionType,
    } = state;

    const onResourceTitleChange = e => {
      updateResourceTitle(e.target.value);
    }

    const onContextualizerPagesChange = e => {
      updateContextualizerPages(e.target.value);
    }
    const refreshUpstreamContextualizationsList = e => {
      refreshContextualizationsList();
    }

    const startDrag = (e) => {
       e.dataTransfer.dropEffect = 'copy';
       e.dataTransfer.setData('text', 'TEST');
    };

    const onDrop = (contentId, payload, selection) => {
      const editorState = contentId === 'main' ? this.state.mainEditorState : this.state.notes[contentId].editorState;
      this.insertContextualization(contentId, EditorState.acceptSelection(editorState, selection));
    };
    return (
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <div
          style={{
            position: 'fixed',
            padding: '1rem',
            left: 0,
            top: 0,
            width: '10%',
            height: '100%',
            zIndex: 3,
            overflow: 'auto'
          }}
        >
          <div
            draggable={true} 
            onDragStart={startDrag}
            style={{
              border: '1px solid black',
              padding: '1em'
            }}
          >
            Draggable resource
          </div>
          {
            Object.keys(contextualizations)
            .map(key => {
              const onClick = () => deleteContextualization(key);
              return (
                <div key={key}>
                  <button
                    onClick={onClick}
                  >
                    Delete contextualization {key}
                  </button>
                </div>
              );
            })
          }
          <div>
          {Object.keys(contextualizations).length > 0 && <div>
            <button onClick={refreshUpstreamContextualizationsList}>Refresh upstream contextualizations list</button>
          </div>}
            Change the contextualizer page :
            <input
              value={contextualizers[Object.keys(contextualizers)[0]].pages}
              onChange={onContextualizerPagesChange}
            >
            </input>
          </div>
          <div>
            Change the contextualizer title :
            <input
              value={resources[Object.keys(resources)[0]].title}
              onChange={onResourceTitleChange}
            >
            </input>
          </div>
          {contextualizationRequest && <div>
          <button onClick={() => insertContextualization()}>Insert contextualization</button>
            </div>}
        </div>
          
        <div
          style={{
            position: 'fixed',
            top: '10%',
            left: '20%',
            height: '80%',
            width: '80%',
            overflow: 'hidden'
          }}>
          <SectionEditor 
            mainEditorState={mainEditorState}
            notes={notes}
            contextualizations={contextualizations}
            contextualizers={contextualizers}
            resources={resources}
            lastInsertionType={lastInsertionType} 
            
            onEditorChange={onEditorChange}
            onContextualizationRequest={onContextualizationRequest}
            onNoteAdd={addNote}
            onNoteDelete={deleteNote}
            onContextualizationRequest={onContextualizationRequest}
            onDataChange={onDataChange}
            onDrop={onDrop}

            onContextualizationClick={onContextualizationClick}
            onContextualizationMouseOver={onContextualizationMouseOver}
            onContextualizationMouseOut={onContextualizationMouseOut}

            onNotePointerMouseOver={onNotePointerMouseOver}
            onNotePointerMouseOut={onNotePointerMouseOut}
            onNotePointerMouseClick={onNotePointerMouseClick}
            
            inlineContextualizationComponents={inlineContextualizationComponents}
            blockContextualizationComponents={blockContextualizationComponents}
            allowNotesInsertion={true}
            editorStyles={{
              mainEditor: {
                position: 'relative',
                left: 0,
                top: 0,
                width: '50%',
                height: '100%',
                padding:'1em 25% 1em 25%'
              }
            }}
          />
        </div>
      </div>
    );
  }
}