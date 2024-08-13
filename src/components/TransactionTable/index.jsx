import React, { useState } from 'react';
import { Table, Select, Radio } from 'antd';
import searchImg from '../../assets/search.svg';
import { unparse,parse } from 'papaparse'; 

function TransactionTable({ transactions,addTransaction,fetchTransactions }) {
  const { Option } = Select;
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortKey, setSortKey] = useState('');
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Tag',
      dataIndex: 'tag',
      key: 'tag',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
  ];

  let filteredTransactions = transactions.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      item.type.includes(typeFilter)
  );

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortKey === 'date') {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === 'amount') {
      return a.amount - b.amount;
    } else {
      return 0;
    }
  });

  
  function exportToCsv() {
    var csv = unparse({
      fields: ['name', 'type', 'tag', 'date', 'amount'],
      data: transactions.map((transaction) => ({
        name: transaction.name,
        type: transaction.type,
        tag: transaction.tag,
        date: transaction.date,
        amount: transaction.amount,
      })),
    });

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    var url = window.URL.createObjectURL(blob);

    var link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'transactions.csv');

    link.click();

    document.body.removeChild(link);
  }

  function importFromCsv(event) {
    event.preventDefault();
    
    try {
      parse(event.target.files[0], {
        header: true,
        complete: async function (results) {
          for (const transaction of results.data) {
            const newTransaction = {
              ...transaction,
              amount: parseFloat(transaction.amount),
            };
            await addTransaction(newTransaction, true);
          }
  
          toast.success("All Transactions Added");
          fetchTransactions();
          event.target.value = null;
        },
        error: function (error) {
          toast.error("Error parsing CSV file: " + error.message);
        }
      });
    } catch (e) {
      toast.error("Error processing CSV file: " + e.message);
    }
  }

  return (
    <div
      style={{
        width: '95%',
        padding: '0rem 2rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '1rem',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <div className="input-flex">
          <img src={searchImg} width="16" alt="Search" />
          <input
            placeholder="Search by Name"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          className="select-input"
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
      </div>

      <div className="my-table">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            marginBottom: '1rem',
          }}
        >
          <h2>My Transactions</h2>

          <Radio.Group
            className="input-radio"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value="">No Sort</Radio.Button>
            <Radio.Button value="date">Sort by Date</Radio.Button>
            <Radio.Button value="amount">Sort by Amount</Radio.Button>
          </Radio.Group>
          <button className="btn" onClick={exportToCsv}>
            Export to CSV
          </button>
          <label htmlFor="file-csv" className="btn btn-blue">
            Import from CSV
          </label>
          <input
            id="file-csv"
            type="file"
            accept=".csv"
            required
            onChange={importFromCsv}
            style={{ display: 'none' }}
          />
        </div>

        <Table columns={columns} dataSource={sortedTransactions} />
      </div>
    </div>
  );
}

export default TransactionTable;
