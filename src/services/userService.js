const TABLE_NAME = 'User1';

/**
 * Fetch users with optional filtering
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise<Object>} - The response data and metadata
 */
export const fetchUsers = async (params = {}) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const queryParams = {
      fields: [
        'Name', 'email', 'roles', 'active_role'
      ],
      // Apply additional filters from params
      ...params
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, queryParams);
    return response;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Get a specific user by ID
 * @param {number|string} id - The ID of the user
 * @returns {Promise<Object>} - The user data
 */
export const getUserById = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const response = await apperClient.getRecordById(TABLE_NAME, id);
    return response;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Get a user by email
 * @param {string} email - The email of the user to find
 * @returns {Promise<Object|null>} - The user data or null if not found
 */
export const getUserByEmail = async (email) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      fields: ['Name', 'email', 'roles', 'active_role'],
      where: [
        { fieldName: 'email', operator: 'ExactMatch', values: [email] }
      ]
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    return response.data && response.data.length > 0 ? response.data[0] : null;
  } catch (error) {
    console.error(`Error fetching user with email ${email}:`, error);
    return null;
  }
};

/**
 * Create a new user
 * @param {Object} user - The user data
 * @returns {Promise<Object>} - The created user data
 */
export const createUser = async (user) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      records: [{
        Name: user.name || user.email,
        email: user.email,
        roles: user.roles || ['renter'],
        active_role: user.activeRole || 'renter'
      }]
    };

    const response = await apperClient.createRecord(TABLE_NAME, params);
    return response;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Update an existing user
 * @param {number|string} id - The ID of the user to update
 * @param {Object} updates - The fields to update
 * @returns {Promise<Object>} - The updated user data
 */
export const updateUser = async (id, updates) => {
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
    console.error(`Error updating user with ID ${id}:`, error);
    throw error;
  }
};

export default {
  fetchUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser
};