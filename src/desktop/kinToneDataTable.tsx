
import React from 'react';
import ReactDOM from 'react-dom';
import * as Kuc from '@kintone/kintone-ui-component';
import type { TableColumn } from '@kintone/kintone-ui-component';
// import { Label, Table, TableColumn, Text, IconButton } from '@kintone/kintone-ui-component';
import type * as kintoneRestApiClientTypes from "@kintone/rest-api-client/lib/client/types";
import type * as KintoneFieldsProperty from '@kintone/rest-api-client/lib/KintoneFields/types/property';
import type { KintoneRecordField } from "@kintone/rest-api-client";
// import type { OneOf } from '@kintone/rest-api-client/lib/KintoneFields/types/field';
import IdCell from './IdCell';
import Cell from './Cell';
import type { IReferenceTable } from '../../type/ReferenceTable';
import recordsGetter from "./recordsGetter";

interface IKintoneDataTableProps {
  referenceTable: IReferenceTable,
  selfRecord: kintoneRestApiClientTypes.Record,
  withHeader: boolean
}
interface IKintoneDataTableState {
  records: kintoneRestApiClientTypes.Record[],
  message: string,
  offset: number,
  limit: number,
  noPrevious: boolean,
  noMore: boolean
}
class KintoneDataTable extends React.Component<IKintoneDataTableProps, IKintoneDataTableState> {
  constructor(props: IKintoneDataTableProps) {
    super(props);
    this.state = {
      records: [], // this.props.records,
      message: "...loading..",
      offset: 0,
      limit: Number(this.props.referenceTable.limit) || 5,
      noPrevious: true,
      noMore: false
    }
    setTimeout(() => {
      this.loadData(); // init data loading
    }, 64);
  }
  loadData = () => {
    return recordsGetter.getFromSingleReferenceTable(this.props.referenceTable, this.props.selfRecord, this.state.offset, this.state.limit)
      .then(getRecordsResponce => {
        this.setState({
          records: getRecordsResponce.records || [],
          noPrevious: this.state.offset <= 0,
          noMore: !getRecordsResponce?.records?.length || (getRecordsResponce.records.length < this.state.limit),
          message: " offset " + this.state.offset + " from " + getRecordsResponce?.records?.length + "records."
        })
      }).catch(err => {
        if (err.code === 'CB_VA01') {
          console.error("at KintoneDataTable recordsGetter.getFromSingleReferenceTable err=", err, this.props.referenceTable)
          this.setState({
            message: "実装誤りにつき、保守員に連絡要。"
          })
        } else if (err.code === 'GAIA_IL08') {
          this.setState({
            message: "likeに空を指定する等の検索条件誤り"
          })
        } else if (err.message) {
          // alert("データを読めませんでした?")
          console.error("ERROR at KintoneDataTable loadData by onClickLeft:-", err)
          this.setState({
            message: err.code + ":" + err.message
          })
        } else {
          alert("データを読めませんでした!")
          console.error("ERROR at KintoneDataTable loadData by onClickLeft:--", JSON.stringify(err))
          this.setState({
            message: "Failed to load data."
          })
        }
      })
  }

  onClickLeft = (e: React.SyntheticEvent<EventTarget, Event>) => {
    let newOffset = this.state.offset - this.state.limit;
    if (newOffset < 0) {
      newOffset = 0;
    }
    if (this.state.offset !== newOffset) {
      this.setState({
        message: "...loading previos records..",
        offset: newOffset
      },
        () => this.loadData()
      );
    }
  }
  onClickRight = (e: React.SyntheticEvent<EventTarget, Event>) => {
    let newOffset = this.state.offset + this.state.limit;
    if ((this.state.offset !== newOffset)) {
      this.setState({
        message: "...loading next records..",
        offset: newOffset
      },
        () => this.loadData()
      );
    }
  }
  render() {
    return (<div>
      <label className="control-label-text-gaia" role="presentation">{this.props.referenceTable.subTitle.length > 0 ? this.props.referenceTable.subTitle : this.props.referenceTable.appName} </label>
      <Kuc.Table
        columns={[
          ...(this.props.withHeader ? [{
            header: 'id',
            cell: ({ rowIndex }: { rowIndex: number }) => <IdCell app={this.props.referenceTable.app} $id={(this.state.records[rowIndex].$id as KintoneRecordField.ID).value} />
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
      <div className="pager-gaia">
        {(!this.state.noPrevious) && (<button onClick={this.onClickLeft} type="button"
          style={{ userSelect: "none", justifyContent: "flex-end", borderStyle: "none" }}
          title="前へ" aria-label="前へ" itemProp="prev"
          className="gaia-ui-listtable-pagercomponent-prev pager-prev-gaia"
        >≺</button>)}
        &nbsp;
        <span className="kuc-label" role="presentation">
          {this.state.message}
        </span>&nbsp;
        {(!this.state.noMore) && (<button onClick={this.onClickRight} type="button"
          style={{ userSelect: "none", justifyContent: "right", borderStyle: "none" }}
          title="次へ" aria-label="次へ" itemProp="next"
          className="gaia-ui-listtable-pagercomponent-next pager-next-gaia"
        >≻</button>)}
      </div>
    </div>);
  }
}

export function renderCustomReferrenceTable(kintoneEvent, referenceTables: IReferenceTable[]) {
  // console.log("at cutsom refference table render enter:", referenceTables);
  let renderPromise = new kintone.Promise((resolve1, _) => { resolve1("async render process begin"); });
  let recordLoaderPromise = new kintone.Promise((resolve1, _) => { resolve1("async record load process begin"); });
  referenceTables.forEach((referenceTable, index) => {
    const space = kintone.app.record.getSpaceElement(referenceTable.space);
    if (space) {
      // 1時期に消費するkintone rest api records cursorの数を1個に制限する為、async処理を順次実行する。
      renderPromise = renderPromise
        .then(_ /*recordsResponse*/ => {
          const domRoot = document.createElement('div');
          domRoot.id = 'custom-reference-table-plugin-' + index;
          domRoot.classList.add(kintoneEvent.type === 'app.record.detail.show' ? 'custom-reference-table-plugin-detail' : 'custom-reference-table-plugin-print');
          // const kintoneDataTable1 = new KintoneDataTable({
          //   referenceTable,
          //   records: recordsResponse.records,
          //   withHeader: kintoneEvent.type === 'app.record.detail.show'
          // });
          space.appendChild(domRoot);
          return new Promise((resolve2) => {
            ReactDOM.render(
              // kintoneDataTable1.render(),
              <KintoneDataTable
                referenceTable={referenceTable}
                selfRecord={kintoneEvent.record}
                withHeader={kintoneEvent.type === 'app.record.detail.show'}
              />,
              domRoot,
              () => { // renderの終了を待たないと、「Uncaught Error: Processing event handler exists.」等のエラーに成った。
                resolve2(null /*kintoneDataTable1*/);
                // console.log("at KintoneDataTable render done:#" + index)
              }
            );
          });
        })
      // .then((kintoneDataTable1: KintoneDataTable) => {
      //   recordLoaderPromise = recordLoaderPromise.then(_ => recordsGetter.getFromSingleReferenceTable(referenceTable, kintoneEvent.record))
      //     .then(recordsResponse => {
      //       console.log(`at cutsom refference table#${index}: load app=` + referenceTable.appName + ", records=" + recordsResponse?.records?.length)
      //       kintoneDataTable1.setData(recordsResponse.records);
      //     });
      // });
    }
  });
  return renderPromise.then(_ => { // 順次処理した非同期処理の完了を期待する
    // console.log("at cutsom refference table render Done:@" + referenceTables.length);
    return recordLoaderPromise;
  })
    .then(_ => {
      // console.log("at cutsom refference table records load Done:@" + referenceTables.length);
    })
    .catch(err => {
      console.error("ERROR at cutsom refference table render", err)
    });
}