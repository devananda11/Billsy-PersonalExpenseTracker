import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Cards from '../components/Cards';
import AddExpenseModal from '../components/Modal/AddExpense';
import AddIncomeModal from '../components/Modal/AddIncome';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import { collection, addDoc, getDocs, query } from 'firebase/firestore';
import { auth, db } from '../firebase'; 
import TransactionTable from '../components/TransactionTable';
import ChartComponent from '../components/Charts';
import NoTransactions from '../components/NoTransaction';

function Dashboard() {
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setisExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setisIncomeModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);

  const showExpenseModal = () => {
    setisExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setisIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setisExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setisIncomeModalVisible(false);
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format('YYYY-MM-DD'),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name
    };
    addTransaction(newTransaction);
    setisExpenseModalVisible(false);
    setisIncomeModalVisible(false);
  };

  async function addTransaction(transaction,many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log('Document written with ID: ', docRef.id);
      if (!many) toast.success('Transaction added');
      fetchTransactions(); 
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
      console.log(transactionsArray);
      toast.success('Transactions fetched!');
    }
    setLoading(false);
  }
  useEffect(()=>{
    calculateBalance();
  },[transactions])
  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpenses(expensesTotal);
    setCurrentBalance(incomeTotal - expensesTotal);
  };

  let sortedTransactions=transactions.sort((a, b) => {
    
      return new Date(a.date) - new Date(b.date);
    }
  )
  return (
    <div>
      <Header />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Cards
            income={income}
            expenses={expenses}
            currentBalance={currentBalance}
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
          />
          {transactions && transactions.length!=0?<ChartComponent sortedTransactions={sortedTransactions}/>:<NoTransactions/>}
          
          <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
          <TransactionTable transactions={transactions} addTransaction={addTransaction} fetchTransactions={fetchTransactions}/>
        </>
      )}
    </div>
  );
}

export default Dashboard;
