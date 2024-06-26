const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
      const data = await pool.query(
          `SELECT * FROM public.inventory
          JOIN public.classification
          ON inventory.classification_id = classification.classification_id
          WHERE inventory.classification_id = $1`,
          [classification_id]
      )
      return data.rows
  } catch (error) {
      console.error("getclassificationbyid error" + error)
  }
}

/* ***************************
*  Get all inventory item by inventory id
* ************************** */
async function getInventoryByInventoryId(inventory_id) {
  try {
      const data = await pool.query(
          `SELECT * FROM public.inventory
          WHERE inv_id = $1`,
          [inventory_id]
      )
      return data.rows
  } catch(error){
      console.error("getinventorybyid error" + error)
  }
}
/* ***************************
 *  Add Classification
 * ************************** */
async function addClassDatabase(classification_name){
  try {
      const data = await pool.query(
          `INSERT INTO public.classification (classification_name) VALUES ($1)`,
      [classification_name]
      )

      return data.rows
  } catch(error) {
      console.error("addClassDatabase error" + error)
  }
}

/* ***************************
*  Add Inventory
* ************************** */
async function addInvDatabase(
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
  classification_id){
  try {
      const sql = "INSERT INTO public.inventory (inv_make,inv_model,inv_year,inv_description,inv_image,inv_thumbnail,inv_price,inv_miles,inv_color,classification_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)"
      const data = await pool.query(sql, [inv_make,inv_model,inv_year,inv_description,inv_image,inv_thumbnail,inv_price,inv_miles,inv_color,classification_id])

      return data.rows
  } catch(error) {
      console.error("addClassDatabase error" + error)
  }
}

async function checkExistingClassification(classification_name){
  try {
  const sql = `SELECT * FROM classification WHERE classification_name = $1`
  const className = await pool.query(sql, [classification_name])
      console.log(className.rowCount)
      if (className.rowCount == 0) {
          return false
      } else {
          return className.rowCount
      }
  } catch (error) {
      throw new Error('There is an error upon checking if classification name exists')
  }
  
}

/* ***************************
*  Update Inventory
* ************************** */
async function updateInventory(
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
  classification_id,
  inv_id){
  try {
      const sql = "UPDATE public.inventory SET inv_make = $1, inv_model = $2,inv_year = $3, inv_description = $4, inv_image = $5, inv_thumbnail = $6, inv_price = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
      const data = await pool.query(sql, [
          inv_make,
          inv_model,
          inv_year,
          inv_description,
          inv_image,
          inv_thumbnail,
          inv_price,
          inv_miles,
          inv_color,
          classification_id,
          inv_id])
      return data.rows[0]
  } catch(error) {
      console.error("Update Inventory Database " + error)
  }
}

/* ***************************
*  Update Inventory
* ************************** */
async function deleteInventory(
  inv_id){
  try {
      const sql = "DELETE FROM public.inventory WHERE inv_id = $1"
      const data = await pool.query(sql, [inv_id])
      return data
  } catch(error) {
      console.error("Delete Inventory Database " + error)
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getInventoryByInventoryId, addClassDatabase, addInvDatabase, checkExistingClassification, updateInventory, deleteInventory};