
import React from 'react';
import ReactDOM from 'react-dom';
import * as Kuc from '@kintone/kintone-ui-component';
import type { TableColumn } from '@kintone/kintone-ui-component';
// import { Label, Table, TableColumn, Text, IconButton } from '@kintone/kintone-ui-component';
import * as KintoneFieldsProperty from '@kintone/rest-api-client/lib/KintoneFields/types/property';
import * as KintoneFieldsField from "@kintone/rest-api-client/lib/KintoneFields/types/field";
import type { OneOf } from '@kintone/rest-api-client/lib/KintoneFields/types/field';
import IdCell from './IdCell';
import Cell from './Cell';
import { IReferenceTable } from '../../type/ReferenceTable';
import recordsGetter from "./recordsGetter";

interface IKintoneDataTableProps {
  referenceTable: IReferenceTable,
  // records: Record<string, OneOf>[],
  withHeader: boolean
}
interface IKintoneDataTableState {
  records: Record<string, OneOf>[],
  message: string,
  offset: number
}
class KintoneDataTable extends React.Component<IKintoneDataTableProps, IKintoneDataTableState> {
  constructor(props: { referenceTable: IReferenceTable, withHeader: boolean }) {
    super(props);
    this.state = {
      records: [],
      message: "...loading..",
      offset: 0
    }
  }
  setData = (records: Record<string, OneOf>[]) => {
    setTimeout(() => {
      console.log("at KintoneDataTable setData called: records.length=" + records.length, this.props.referenceTable.appName)
      this.setState({ records: records, message: records.length + "record. " },
        (() => {
          console.log("at KintoneDataTable setData callback, this.state=", this.state);
          this.forceUpdate();
        }));
    }, 60);
  }
  onClickLeft = (e: React.SyntheticEvent<EventTarget, Event>) => {
    console.log("at onClickLeft", e);
    this.setState({ message: "record scroll by onClickLeft " },
      (() => {
        console.log("at KintoneDataTable onClickLeft callback, this.state=", this.state);
        this.forceUpdate();
      }));
  }
  onClickRight = (e: React.SyntheticEvent<EventTarget, Event>) => {
    setTimeout(() => {
      console.log("at onClickRight", e);
      this.setState({ message: "record scroll by onClickRight " },
        (() => {
          console.log("at KintoneDataTable onClickRight callback, this.state=", this.state);
        }));
    }, 60);
    setTimeout(() => {
      console.log("at KintoneDataTable onClickRight setTimeout, this.state=", this.state);
      this.forceUpdate(() => {
        console.log("at KintoneDataTable onClickRight setTimeout, forceUpdate callback this.state=", this.state);
      });
    }, 90);
  }
  render() {
    return (<div>
      <Kuc.Label text={this.props.referenceTable.subTitle.length > 0 ? this.props.referenceTable.subTitle : this.props.referenceTable.appName} />
      <Kuc.Table
        columns={[
          ...(this.props.withHeader ? [{
            header: 'id',
            cell: ({ rowIndex }: { rowIndex: number }) => <IdCell app={this.props.referenceTable.app} $id={(this.state.records[rowIndex].$id as KintoneFieldsField.ID).value} />
          }] : []),
          ...(this.props.referenceTable.showFields || []).map(fieldProp => ({ // ...referenceTable.shows.map(({ code }) => ({
            header: fieldProp.label, // properties[code].label,
            cell: ({ rowIndex }: { rowIndex: number }) =>
              <Cell
                type={fieldProp.type}
                value={this.state.records[rowIndex][fieldProp.code].value}
                property={fieldProp} // properties[code]
              />
          }))
        ] as TableColumn[]}
        defaultRowData={(this.props.referenceTable.showFields || []).reduce((r, fieldProp) => {
          r[fieldProp.code] = { type: fieldProp.type, value: (fieldProp as KintoneFieldsProperty.SingleLineText).defaultValue || '' };
          return r;
        },
          {})}
        data={this.state.records}
        actionButtonsShown={false}
      />
      <span>
        <Kuc.IconButton type='left' shape='square' color='green' onClick={this.onClickLeft} />
        <Kuc.Text value={this.state.message} />
        <Kuc.IconButton type='right' shape='square' color='green' onClick={this.onClickRight} />
      </span>
    </div>);
  }
}

export function renderCustomReferrenceTable(kintoneEvent, referenceTables: IReferenceTable[]) {
  console.log("at cutsom refference table render enter:", referenceTables);
  let renderPromise = new kintone.Promise((resolve1, _) => { resolve1("async render process begin"); });
  let recordLoaderPromise = new kintone.Promise((resolve1, _) => { resolve1("async record load process begin"); });
  referenceTables.forEach((referenceTable, index) => {
    const space = kintone.app.record.getSpaceElement(referenceTable.space);
    if (space) {
      // 1時期に消費するkintone rest api records cursorの数を1個に制限する為、async処理を順次実行する。
      renderPromise = renderPromise.then(_ => {
        const domRoot = document.createElement('div');
        domRoot.id = 'custom-reference-table-plugin-' + index;
        domRoot.classList.add(kintoneEvent.type === 'app.record.detail.show' ? 'custom-reference-table-plugin-detail' : 'custom-reference-table-plugin-print');
        const kintoneDataTable1 = new KintoneDataTable({
          referenceTable,
          withHeader: kintoneEvent.type === 'app.record.detail.show'
        });
        space.appendChild(domRoot);
        return new Promise((resolve2) => {
          ReactDOM.render(
            kintoneDataTable1.render(),
            domRoot,
            () => { // renderの終了を待たないと、「Uncaught Error: Processing event handler exists.」等のエラーに成った。
              resolve2(kintoneDataTable1);
              console.log("at KintoneDataTable render done:#" + index)
            }
          );
        });
      })
        .then((kintoneDataTable1: KintoneDataTable) => {
          recordLoaderPromise = recordLoaderPromise.then(_ => recordsGetter.getFromSingleReferenceTable(referenceTable, kintoneEvent.record))
            .then(recordsResponse => {
              console.log(`at cutsom refference table#${index}: load app=` + referenceTable.appName + ", records=" + recordsResponse?.records?.length)
              kintoneDataTable1.setData(recordsResponse.records);
            });
        });
    }
  });
  return renderPromise.then(_ => { // 順次処理した非同期処理の完了を期待する
    console.log("at cutsom refference table render Done:@" + referenceTables.length);
    return recordLoaderPromise;
  })
    .then(_ => {
      console.log("at cutsom refference table records load Done:@" + referenceTables.length);
    })
    .catch(err => {
      console.error("ERROR at cutsom refference table render", err)
    });
}