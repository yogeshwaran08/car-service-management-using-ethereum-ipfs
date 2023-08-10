<div class="left">
                    <UserInput uploadData={uploadData} handleSubmit={handleSubmit} handleChange={handleChange}/>
                </div>

                <div class="right">
                    <form onSubmit={getFiles}>
                        <label>Enter the VIN number</label>
                        <input type="text" name="searchVIN" value={searchVIN} onChange={handleSearchChange}/>
                        <button type='submit'>Search</button>
                    </form>

                    <div class="scrollable">
                        {outData.map((s,index) => (
                        <SearchTable obj={s}/> ))}
                    </div> 
                </div>