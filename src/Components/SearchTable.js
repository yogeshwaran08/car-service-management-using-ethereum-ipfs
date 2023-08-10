import React from 'react'

const SearchTable = ({obj}) => {
  return (
    <div style={{border : "1px solid black"}}>
        <table class="searchElement">
            <tbody>
            <tr>
                <td>VIN</td>
                <td>{obj.vin}</td>
            </tr>
            <tr>
                <td>Model Types</td>
                <td>{obj.model_type}</td>
            </tr>
            <tr>
                <td>Version</td>
                <td>{obj.version}</td>
            </tr>
            <tr>
                <td>color</td>
                <td>{obj.color}</td>
            </tr>
            <tr>
                <td>Country</td>
                <td>{obj.country}</td>
            </tr>
            <tr>
                <td>Dealer Code</td>
                <td>{obj.dealer_code}</td>
            </tr>
            <tr>
                <td>Dealer</td>
                <td>{obj.dealer}</td>
            </tr>
            <tr>
                <td>RO</td>
                <td>{obj.ro}</td>
            </tr>
            <tr>
                <td>Odometer</td>
                <td>{obj.odometer}</td>
            </tr>
            <tr>
                <td>Part Number</td>
                <td>{obj.part_number}</td>
            </tr>
            <tr>
                <td>Part Name</td>
                <td>{obj.part_name}</td>
            </tr>
            <tr>
                <td>Technician Description</td>
                <td>{obj.technician_description}</td>
            </tr>
            </tbody>
        </table>
    </div>
  )
}

export default SearchTable