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
      <Line character='=' />

      {Array(5)
        .fill()
        .map((_, i) => (
          <Row
            left={<Text bold={true}>Item {i}:</Text>}
            right={formatMoney(1950)}
          />
          // <span key={i + 1}>Hello {i + 1}</span>
        ))}
      {/* {invoice?.invoiceItemList?.map((item, i) => (
      <Row left={`${item.itemName}`} right={item.total} key={i + 1} />
      ))} */}
      <Line character='=' />
      <Row
        left={<Text bold={true}>Total:</Text>}
        right={<Text>{invoice?.invoiceTotal}</Text>}
      />
      <Barcode align='center' type='UPC-A' content={invoice.id} />
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
