const TABLE_NAME = 'clothing_item';

/**
 * Fetch clothing items with optional filtering
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise<Object>} - The response data and metadata
 */
export const fetchClothingItems = async (params = {}) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const queryParams = {
      fields: [
        'Name', 'title', 'designer', 'category', 'description', 'retail_price', 
        'rental_price', 'size', 'condition', 'color', 'available_from', 
        'available_to', 'images', 'shipping', 'occasion_tags', 'rating'
      ],
      orderBy: [
        { field: 'CreatedOn', direction: 'DESC' }
      ],
      // Apply additional filters from params
      ...params
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, queryParams);
    return response;
  } catch (error) {
    console.error('Error fetching clothing items:', error);
    throw error;
  }
};

/**
 * Get a specific clothing item by ID
 * @param {number|string} id - The ID of the clothing item
 * @returns {Promise<Object>} - The clothing item data
 */
export const getClothingItemById = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const response = await apperClient.getRecordById(TABLE_NAME, id);
    return response;
  } catch (error) {
    console.error(`Error fetching clothing item with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Get featured clothing items based on rating and availability
 * @param {number} limit - Number of items to return
 * @returns {Promise<Array>} - Array of featured clothing items
 */
export const getFeaturedClothingItems = async (limit = 6) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        'Name', 'title', 'designer', 'category', 'description', 'retail_price', 
        'rental_price', 'size', 'color', 'images', 'rating'
      ],
      orderBy: [
        { field: 'rating', direction: 'DESC' }
      ],
      pagingInfo: {
        limit: limit,
        offset: 0
      }
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching featured clothing items:', error);
    return [];
  }
};

/**
 * Create a new clothing item listing
 * @param {Object} item - The clothing item data
 * @returns {Promise<Object>} - The created item data
 */
export const createClothingItem = async (item) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      records: [{
        title: item.title,
        designer: item.designer,
        category: item.category,
        description: item.description,
        retail_price: parseFloat(item.retailPrice),
        rental_price: parseFloat(item.rentalPrice),
        size: item.size,
        condition: item.condition,
        color: item.color,
        available_from: item.availableFrom,
        available_to: item.availableTo,
        images: Array.isArray(item.images) ? JSON.stringify(item.images) : item.images,
        shipping: item.shipping,
        occasion_tags: item.tags
      }]
    };

    const response = await apperClient.createRecord(TABLE_NAME, params);
    return response;
  } catch (error) {
    console.error('Error creating clothing item:', error);
    throw error;
  }
};

/**
 * Update an existing clothing item
 * @param {number|string} id - The ID of the item to update
 * @param {Object} updates - The fields to update
 * @returns {Promise<Object>} - The updated item data
 */
export const updateClothingItem = async (id, updates) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      records: [{
        Id: id,
        ...updates
      }]
    };

    const response = await apperClient.updateRecord(TABLE_NAME, params);
    return response;
  } catch (error) {
    console.error(`Error updating clothing item with ID ${id}:`, error);
    throw error;
  }
};

export default {
  fetchClothingItems,
  getClothingItemById,
  getFeaturedClothingItems,
  createClothingItem,
  updateClothingItem
};