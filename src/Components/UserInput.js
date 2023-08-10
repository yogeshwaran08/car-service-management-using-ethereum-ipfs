import React from 'react';
import "./userInput.css"

const UserInput = ({uploadData, handleSubmit, handleChange, errorMessages}) => {
  return (
    <form onSubmit={handleSubmit}>
        <table>
            <tbody>                          
                <tr>
                    <td class="label"><label>VIN</label></td>
                    <td><input type='text' 
                    class="input"
                    name="vin"
                    value={uploadData.vin}
                    onChange={handleChange} 
                    required></input></td>
                </tr>
                
                <tr>
                    <td class="label"><label>Model Type</label></td>
                    <td><input class="input" 
                    type='text' 
                    name="model_type" 
                    value={uploadData.model_type} 
                    onChange={handleChange} 
                    required></input></td>
                </tr>
                <tr>   
                    <td class="label"><label>Version</label></td>
                    <td><input class="input" 
                    type='text' 
                    name="version" 
                    value={uploadData.version} 
                    onChange={handleChange} 
                    required></input></td>
                </tr>
                <tr>    
                    <td class="label"><label>Color</label></td>
                    <td><input class="input" 
                    type='text'
                    name="color" 
                    value={uploadData.color} 
                    onChange={handleChange} 
                    required></input></td>
                </tr>
                <tr>
                    <td class="label"><label>Country</label></td>
                    <td><input class="input" 
                    type='text' 
                    name='country' 
                    value={uploadData.country} 
                    onChange={handleChange} 
                    required></input></td>
                </tr>
                <tr>
                    <td class="label"><label>Dealer Code</label></td>
                    <td><input class="input" 
                    type='text' 
                    value={uploadData.dealer_code} 
                    name="dealer_code" 
                    onChange={handleChange} required></input></td>
                </tr>
                <tr>
                    <td class="label"><label>Dealer</label></td>
                    <td><input class="input" 
                    type='text' 
                    value={uploadData.dealer} 
                    name="dealer" 
                    onChange={handleChange} required></input></td>
                </tr>
                <tr>
                    <td class="label"><label>RO</label></td>
                    <td><input class="input" 
                    type='text' 
                    value={uploadData.ro} 
                    name="ro" onChange={handleChange} required></input></td>
                </tr>
                
                <tr>
                    <td class="label"><label>Odometer</label></td>
                    <td><input class="input" 
                    type='number' 
                    value={uploadData.odometer} 
                    name="odometer" 
                    onChange={handleChange} required></input></td>
                </tr>
                <tr>
                    <td class="label"><label>Part Number</label></td>
                    <td><input class="input" 
                    type='text' 
                    value={uploadData.part_number} 
                    name='part_number' 
                    onChange={handleChange} required></input></td>
                </tr>
                <tr>
                    <td class="label"><label>Part Name</label></td>
                    <td><input class="input" 
                    type='text' 
                    value={uploadData.part_name} 
                    name="part_name" 
                    onChange={handleChange} required></input></td>
                </tr>
                <tr>
                    <td class="label"><label>Technician Description</label></td>
                    <td><input class="input" 
                    type='text' 
                    value={uploadData.technician_description} 
                    name="technician_description" 
                    onChange={handleChange} required></input></td>
                </tr>
                <tr>
                    <td colSpan={2} style={{paddingTop:20}}><button class="submitBtn" type='submit'>Add Service</button></td>
                </tr>
                <tr>
                    <td colSpan={2} ><p>{errorMessages}</p></td>
                </tr>
            </tbody>
        </table>
    </form>
  )
}

export default UserInput