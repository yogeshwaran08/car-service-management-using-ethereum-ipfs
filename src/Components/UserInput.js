import React from 'react'

const UserInput = ({uploadData, handleSubmit, handleChange}) => {
  return (
    <form onSubmit={handleSubmit}>
        <table>
            <tbody>                          
                <tr>
                    <td><label>VIN</label></td>
                    <td><input type='text' name="vin" value={uploadData.vin} onChange={handleChange}></input></td>
                </tr>
                
                <tr>
                    <td><label>Model Type</label></td>
                    <td><input type='text' name="model_type" value={uploadData.model_type} onChange={handleChange}></input></td>
                </tr>
                <tr>   
                    <td><label>Version</label></td>
                    <td><input type='text' name="version" value={uploadData.version} onChange={handleChange}></input></td>
                </tr>
                <tr>    
                    <td><label>Color</label></td>
                    <td><input type='text' name="color" value={uploadData.color} onChange={handleChange}></input></td>
                </tr>
                <tr>
                    <td><label>Country</label></td>
                    <td><input type='text' name='country' value={uploadData.country} onChange={handleChange}></input></td>
                </tr>
                <tr>
                    <td><label>Dealer Code</label></td>
                    <td><input type='text' value={uploadData.dealer_code} name="dealer_code" onChange={handleChange}></input></td>
                </tr>
                <tr>
                    <td><label>Dealer</label></td>
                    <td><input type='text' value={uploadData.dealer} name="dealer" onChange={handleChange}></input></td>
                </tr>
                <tr>
                    <td><label>RO</label></td>
                    <td><input type='text' value={uploadData.ro} name="ro" onChange={handleChange}></input></td>
                </tr>
                
                <tr>
                    <td><label>Odometer</label></td>
                    <td><input type='number' value={uploadData.odometer} name="odometer" onChange={handleChange}></input></td>
                </tr>
                <tr>
                    <td><label>Part Number</label></td>
                    <td><input type='text' value={uploadData.part_number} name='part_number' onChange={handleChange}></input></td>
                </tr>
                <tr>
                    <td><label>Part Name</label></td>
                    <td><input type='text' value={uploadData.part_name} name="part_name" onChange={handleChange}></input></td>
                </tr>
                <tr>
                    <td><label>Technician Description</label></td>
                    <td><input type='text' value={uploadData.technician_description} name="technician_description" onChange={handleChange}></input></td>
                </tr>
            </tbody>
        </table>
        <button type='submit'>Add Service</button>
    </form>
  )
}

export default UserInput