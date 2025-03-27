import api from './api';
import userService from './user.service';
import bulletinProxyService from './bulletinProxyService';

/**
 * Service für Admin-Dashboard-Funktionen
 */
class DashboardService {
  /**
   * Dashboard-Statistiken abrufen
   * @returns {Promise} Statistiken für das Dashboard
   */
  async getDashboardStats() {
    try {
      // Standardwerte für Statistiken
      const statsDefault = {
        users: {
          total: 0,
          doctors: 0,
          hospitals: 0,
          admins: 0
        },
        bulletins: {
          total: 0,
          active: 0,
          pending: 0,
          archived: 0
        },
        contacts: {
          total: 0,
          pending: 0,
          viewed: 0, 
          responded: 0
        }
      };
      
      // Benutzerstatistiken
      try {
        const usersResponse = await userService.getAllUsers();
        
        // Sicherstellen, dass wir ein Array haben
        const users = Array.isArray(usersResponse.data) ? usersResponse.data : [];
        console.log('Dashboard: Loaded users:', users.length);
        
        if (users.length > 0) {
          statsDefault.users = {
            total: users.length,
            doctors: users.filter(user => user.userType === 'Arzt').length,
            hospitals: users.filter(user => user.userType === 'Klinik').length,
            admins: users.filter(user => user.userType === 'Admin').length
          };
        }
      } catch (userError) {
        console.error('Error fetching users for dashboard:', userError);
        // Standardwerte für users beibehalten
      }
      
      // Bulletin-Statistiken
      try {
        const bulletinsResponse = await bulletinProxyService.getAllBulletins();
        
        // Sicherstellen, dass wir ein Array haben
        const bulletins = Array.isArray(bulletinsResponse.data) ? bulletinsResponse.data : [];
        console.log('Dashboard: Loaded bulletins:', bulletins.length);
        
        if (bulletins.length > 0) {
          statsDefault.bulletins = {
            total: bulletins.length,
            active: bulletins.filter(bulletin => bulletin.status === 'active').length,
            pending: bulletins.filter(bulletin => bulletin.status === 'pending').length,
            archived: bulletins.filter(bulletin => bulletin.status === 'archived').length
          };
        }
      } catch (bulletinError) {
        console.error('Error fetching bulletins for dashboard:', bulletinError);
        // Standardwerte für bulletins beibehalten
      }
      
      // Kontaktstatistiken werden später implementiert
      
      return statsDefault;
      
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Bei einem generellen Fehler, Standard-Stats zurückgeben
      return {
        users: {
          total: 0,
          doctors: 0,
          hospitals: 0,
          admins: 0
        },
        bulletins: {
          total: 0,
          active: 0,
          pending: 0,
          archived: 0
        },
        contacts: {
          total: 0,
          pending: 0,
          viewed: 0, 
          responded: 0
        }
      };
    }
  }
  
  /**
   * Die letzten Aktivitäten im System zusammenstellen
   * @param {number} limit - Maximale Anzahl der zurückzugebenden Aktivitäten
   * @returns {Promise} Array mit den letzten Aktivitäten
   */
  async getRecentActivities(limit = 10) {
    try {
      let userActivities = [];
      let bulletinActivities = [];
      
      // Benutzer laden (für Neuregistrierungen)
      try {
        const usersResponse = await userService.getAllUsers();
        
        // Sicherstellen, dass wir ein Array haben
        const users = Array.isArray(usersResponse.data) ? usersResponse.data : [];
        console.log('Dashboard: Loaded users for activities:', users.length);
        
        // Aktivitäten aus Benutzerregistrierungen erstellen
        if (users.length > 0) {
          userActivities = users.map(user => ({
            type: 'user',
            description: user.userType === 'Arzt' 
              ? 'Neuer Arzt registriert' 
              : user.userType === 'Klinik' 
                ? 'Neue Klinik registriert' 
                : 'Neuer Benutzer registriert',
            user: user.name || user.email || 'Unbenannter Benutzer',
            date: new Date(user.createdAt || user.created || Date.now())
          }));
        }
      } catch (userError) {
        console.error('Error fetching users for activities:', userError);
        // Leeres Array beibehalten
      }
      
      // Pinnwand-Einträge laden (für neue Einträge und Aktualisierungen)
      try {
        const bulletinsResponse = await bulletinProxyService.getAllBulletins();
        
        // Sicherstellen, dass wir ein Array haben
        const bulletins = Array.isArray(bulletinsResponse.data) ? bulletinsResponse.data : [];
        console.log('Dashboard: Loaded bulletins for activities:', bulletins.length);
        
        // Aktivitäten aus Pinnwand-Einträgen erstellen
        if (bulletins.length > 0) {
          bulletinActivities = bulletins.map(bulletin => {
            let description = '';
            let activityType = 'bulletin';
            
            // Unterscheidung zwischen verschiedenen Nachrichtentypen
            if (bulletin.messageType === 'Angebot') {
              description = 'Neues Stellenangebot veröffentlicht';
              activityType = 'job_offer';
            } else if (bulletin.messageType === 'Gesuch') {
              description = 'Neues Stellengesuch veröffentlicht';
              activityType = 'job_request';
            } else {
              description = 'Neuer Pinnwand-Eintrag erstellt';
            }
            
            return {
              type: activityType,
              description: description,
              user: bulletin.name || bulletin.email || 'Unbenannter Benutzer',
              date: new Date(bulletin.timestamp || bulletin.createdAt || bulletin.created || Date.now())
            };
          });
        }
      } catch (bulletinError) {
        console.error('Error fetching bulletins for activities:', bulletinError);
        // Leeres Array beibehalten
      }
      
      // Alle Aktivitäten zusammenführen
      const allActivities = [...userActivities, ...bulletinActivities];
      
      // Nach Datum sortieren (neueste zuerst)
      if (allActivities.length > 0) {
        allActivities.sort((a, b) => b.date - a.date);
      }
      
      // Auf gewünschte Anzahl begrenzen
      const limitedActivities = allActivities.slice(0, limit);
      console.log('Dashboard: Returning', limitedActivities.length, 'activities');
      
      return limitedActivities;
      
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      // Bei einem Fehler ein leeres Array zurückgeben
      return [];
    }
  }
}

export default new DashboardService(); 