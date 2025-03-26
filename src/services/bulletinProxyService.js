import bulletinService from './bulletin.service';

// Demo data to use as fallback when API calls fail
const DEMO_BULLETINS = [
  {
    id: 'demo-1',
    messageType: 'Information',
    title: 'Fachärztliche Vertretungs-Pool Radiologie',
    content: 'Organisiere Vertretungs-Pool für kurzfristige Radiologie-Einsätze (max. 3 Monate).',
    timestamp: new Date('2025-05-08T11:20:00'),
    specialty: 'Radiologie',
    federalState: 'Bayern'
  },
  {
    id: 'demo-2',
    messageType: 'Information',
    title: '131. Kongress der DGIM in Wiesbaden',
    content: 'Der 131. Kongress der Deutschen Gesellschaft für Innere Medizin (DGIM) findet vom 03. bis 06. Mai 2025 in Wiesbaden statt. Schwerpunktthemen: Digitalisierung und Präzisionsmedizin.',
    timestamp: new Date('2025-01-15T10:00:00'),
    specialty: 'Innere Medizin',
    federalState: 'Hessen'
  },
  {
    id: 'demo-3',
    messageType: 'Information',
    title: 'Hannover Herz Lungen Messe 2025',
    content: 'Die Hannover Herz Lungen Messe 2025 wird am 21. und 22. März 2025 an der Medizinischen Hochschule Hannover veranstaltet. Aktuelle Fortschritte in Kardiologie und Pneumologie.',
    timestamp: new Date('2024-12-10T14:30:00'),
    specialty: 'Kardiologie, Pneumologie',
    federalState: 'Niedersachsen'
  },
  {
    id: 'demo-4',
    messageType: 'Information',
    title: '23. Europäischer Kongress für Innere Medizin',
    content: 'Der 23. Europäische Kongress für Innere Medizin (ECIM 2025) findet vom 5. bis 8. März 2025 in Florenz, Italien, statt. Internationale Experten diskutieren neueste Erkenntnisse.',
    timestamp: new Date('2025-01-20T09:15:00'),
    specialty: 'Innere Medizin',
    federalState: 'International'
  },
  {
    id: 'demo-5',
    messageType: 'Angebot',
    title: 'Facharzt für Orthopädie in München gesucht',
    content: 'Moderne Klinik in München sucht Facharzt für Orthopädie in Vollzeit. Attraktive Vergütung und flexible Arbeitszeiten.',
    timestamp: new Date('2025-02-15T11:30:00'),
    specialty: 'Orthopädie',
    federalState: 'Bayern',
    startDate: new Date('2025-04-01')
  },
  {
    id: 'demo-6',
    messageType: 'Gesuch',
    title: 'Facharzt für Dermatologie sucht neue Herausforderung',
    content: 'Erfahrener Dermatologe mit 10 Jahren Berufserfahrung sucht neue Stelle im Großraum Berlin. Spezialisiert auf ästhetische Dermatologie.',
    timestamp: new Date('2025-02-10T15:45:00'),
    specialty: 'Dermatologie',
    federalState: 'Berlin',
    startDate: new Date('2025-05-01')
  }
];

// Status flag to track if we're in demo mode
let usingDemoData = false;

/**
 * Service that proxies bulletin requests and provides fallback demo data when API fails
 */
class BulletinProxyService {
  /**
   * Get all bulletins with fallback to demo data
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - Promise with bulletins data
   */
  async getAllBulletins(params = {}) {
    try {
      console.log('BulletinProxyService: Attempting to fetch from real API with params:', params);
      const response = await bulletinService.getAllBulletins(params);
      
      // If we get a valid response with data, use it
      if (response && response.data && Array.isArray(response.data)) {
        console.log('BulletinProxyService: Successfully fetched from real API, found', response.data.length, 'entries');
        usingDemoData = false;
        return response;
      }
      
      // Empty data from API, fall back to demo data
      console.warn('BulletinProxyService: API returned empty data, using demo data');
      return this.getDemoData(params);
    } catch (error) {
      console.error('BulletinProxyService: API failed, using demo data:', error.message);
      return this.getDemoData(params);
    }
  }

  /**
   * Get demo data with filtering applied based on params
   * @param {Object} params - Query parameters for filtering
   * @returns {Object} - Formatted response with demo data
   */
  getDemoData(params = {}) {
    console.log('BulletinProxyService: Using demo data with params:', params);
    usingDemoData = true;
    
    // Apply filtering based on params
    let filteredData = [...DEMO_BULLETINS];
    
    // Filter by messageType if specified
    if (params.messageType) {
      filteredData = filteredData.filter(item => item.messageType === params.messageType);
    }
    
    // Filter by specialty if specified
    if (params.specialty) {
      filteredData = filteredData.filter(item => 
        item.specialty && item.specialty.toLowerCase().includes(params.specialty.toLowerCase())
      );
    }
    
    // Filter by federalState if specified
    if (params.federalState) {
      filteredData = filteredData.filter(item => 
        item.federalState && item.federalState.toLowerCase().includes(params.federalState.toLowerCase())
      );
    }
    
    // Sort results if sort parameter is provided
    if (params.sort) {
      const sortField = params.sort.startsWith('-') ? params.sort.substring(1) : params.sort;
      const sortDirection = params.sort.startsWith('-') ? -1 : 1;
      
      filteredData.sort((a, b) => {
        if (!a[sortField] || !b[sortField]) return 0;
        return a[sortField] > b[sortField] ? sortDirection : -sortDirection;
      });
    }
    
    // Apply limit if specified
    if (params.limit && !isNaN(parseInt(params.limit))) {
      filteredData = filteredData.slice(0, parseInt(params.limit));
    }
    
    console.log('BulletinProxyService: Returning', filteredData.length, 'demo entries');
    return { data: filteredData };
  }

  /**
   * Check if we're currently using demo data
   * @returns {Boolean} - True if using demo data
   */
  isUsingDemoData() {
    return usingDemoData;
  }

  /**
   * Create a new bulletin (will use real API but gracefully handle errors)
   * @param {Object} bulletinData - Bulletin data to create
   * @returns {Promise} - Promise with created bulletin
   */
  async createBulletin(bulletinData) {
    try {
      return await bulletinService.createBulletin(bulletinData);
    } catch (error) {
      console.error('BulletinProxyService: Error creating bulletin:', error.message);
      // Simulate a successful creation with demo data
      const demoCreated = {
        ...bulletinData,
        id: 'demo-' + Date.now(),
        timestamp: new Date()
      };
      return { data: demoCreated, isDemoData: true };
    }
  }

  /**
   * Get a bulletin by ID (will try real API but fallback to demo)
   * @param {String} id - Bulletin ID
   * @returns {Promise} - Promise with the bulletin
   */
  async getBulletinById(id) {
    try {
      return await bulletinService.getBulletinById(id);
    } catch (error) {
      console.error('BulletinProxyService: Error fetching bulletin by ID:', error.message);
      // Check if this is a demo ID
      if (id.startsWith('demo-')) {
        const demoItem = DEMO_BULLETINS.find(item => item.id === id);
        if (demoItem) {
          return { data: demoItem, isDemoData: true };
        }
      }
      throw error; // Re-throw if we can't find a matching demo item
    }
  }

  /**
   * Update a bulletin (will try real API but gracefully handle errors)
   * @param {String} id - Bulletin ID
   * @param {Object} bulletinData - Updated bulletin data
   * @returns {Promise} - Promise with the updated bulletin
   */
  async updateBulletin(id, bulletinData) {
    try {
      return await bulletinService.updateBulletin(id, bulletinData);
    } catch (error) {
      console.error('BulletinProxyService: Error updating bulletin:', error.message);
      // For demo IDs, simulate a successful update
      if (id.startsWith('demo-')) {
        return { 
          data: { ...bulletinData, id, updatedAt: new Date() },
          isDemoData: true 
        };
      }
      throw error;
    }
  }

  /**
   * Delete a bulletin (will try real API but gracefully handle errors)
   * @param {String} id - Bulletin ID
   * @returns {Promise} - Promise with the delete response
   */
  async deleteBulletin(id) {
    try {
      return await bulletinService.deleteBulletin(id);
    } catch (error) {
      console.error('BulletinProxyService: Error deleting bulletin:', error.message);
      // For demo IDs, simulate a successful delete
      if (id.startsWith('demo-')) {
        return { 
          data: { message: 'Demo bulletin deleted successfully' },
          isDemoData: true 
        };
      }
      throw error;
    }
  }
}

// Export a singleton instance
export default new BulletinProxyService(); 