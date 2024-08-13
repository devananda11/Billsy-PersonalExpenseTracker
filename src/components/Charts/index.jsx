import React from 'react';
import { Line,Pie } from '@ant-design/charts';

const ChartComponent = ({sortedTransactions}) => {
  const data = sortedTransactions.map((item)=>
{
    return {date:item.date,amount:item.amount}
})

const spendingdata = sortedTransactions.filter((transaction) => {
    if (transaction.type === "expense"){
        return {tag:transaction.tag,amount:transaction.amount}
}});
  

  const config = {
    data:data,
    xField: 'date',
    yField: 'amount',
    width:500,
    autofit:true
  };
  const spendingconfig={
    data:spendingdata,
    angleField:"amount",
    colorField:"tag",
    width:500,
    autofit:true
  }

  return (
    <div className="charts-wrapper">
        
        <div>
            <h2 style={{marginTop:0}}>Your Analytics</h2>
        <Line {...config}  />
        </div>
        <div>
            <h2>Your Spendings</h2>
            <Pie {...spendingconfig}/>
        </div>
        
    </div>
  )
};

export default ChartComponent;
