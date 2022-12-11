import React from 'react'
import '../css/Receipt.css'
import {
  Br,
  Cut,
  Line,
  Printer,
  Text,
  Row,
  render,
  Barcode,
} from 'react-thermal-printer'

import 'react-thermal-printer'
import { formatdate, formatMoney } from '../reducer'

function useReceipt(invoice, closeFunction) {
  const receipt = (
    <Printer type='epson' width={42} characterSet='korea'>
      <Text align='center' size={{ width: 2, height: 2 }}>
        Al-Fikra Enterprise
      </Text>
      <Text align='center' bold={true}>
        General Merchandize
      </Text>
      <Br />
      <Text underline='true' align='center'>
        Customer Cash Receipt
      </Text>
      <Br />
      <Text bold={true}>Customer: {invoice?.clientName}</Text>
      <Text bold={true}>Phone: {invoice?.clientPhone}</Text>
      <Text bold={true}>Address: {invoice?.clientAddress}</Text>
      <Text bold={true}>
        Date of Purchase: {formatdate(invoice?.invoiceDate)}
      </Text>
      <Br />

      <Text align='center' bold={true} underline={true}>
        List of Items
      </Text>
      <Row left='Item (Quantity)' right={'Total Price'} />
      <Line character='=' />
      {invoice?.invoiceItemList.map((itm, i) => (
        <Row
          key={i + 1}
          left={
            <Text bold={true}>
              {itm.itemName} ({itm.qty}):
            </Text>
          }
          right={formatMoney(itm.total)}
        />
      ))}
      <Line character='=' />
      <Row
        left={<Text bold={true}>Total:</Text>}
        right={<Text>{formatMoney(invoice?.invoiceTotal)}</Text>}
      />
      <Barcode align='center' type='UPC-A' content={invoice?.id} />
      <Cut />
    </Printer>
  )

  const Receipt = () => receipt

  const handlePrint = async () => {
    try {
      const data = await render(receipt)
      const port = await window.navigator.serial.requestPort()
      await port.open({ baudRate: 9600 })

      const writer = port.writable?.getWriter()
      if (writer != null) {
        await writer.write(data)
        writer.releaseLock()
      }
    } catch (error) {
      console.log(error)
      alert(error.message)
    }
  }

  const ActionsTab = () => (
    <div className='actions flex'>
      <button className='button red' onClick={() => closeFunction()}>
        Cancel
      </button>
      <button className='button green' onClick={handlePrint}>
        Print
      </button>
    </div>
  )

  return [Receipt, ActionsTab]
}

export default useReceipt
