import api from './api';
import userService from './user.service';
import bulletinService from './bulletin.service';

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
      // Benutzerstatistiken
      const usersResponse = await userService.getAllUsers();
      const users = usersResponse.data || [];
      
      const userStats = {
        total: users.length,
        doctors: users.filter(user => user.userType === 'Arzt').length,
        hospitals: users.filter(user => user.userType === 'Klinik').length,
        admins: users.filter(user => user.userType === 'Admin').length
      };
      
      // Bulletin-Statistiken
      const bulletinsResponse = await bulletinService.getAllBulletins();
      const bulletins = bulletinsResponse.data || [];
      
      const bulletinStats = {
        total: bulletins.length,
        active: bulletins.filter(bulletin => bulletin.status === 'active').length,
        pending: bulletins.filter(bulletin => bulletin.status === 'pending').length,
        archived: bulletins.filter(bulletin => bulletin.status === 'archived').length
      };
      
      // TODO: Kontaktstatistiken (falls API-Endpunkt existiert)
      const contactStats = {
        total: 0,
        pending: 0,
        viewed: 0, 
        responded: 0
      };
      
      return {
        users: userStats,
        bulletins: bulletinStats,
        contacts: contactStats
      };
      
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
  
  /**
   * Die letzten Aktivitäten im System zusammenstellen
   * @param {number} limit - Maximale Anzahl der zurückzugebenden Aktivitäten
   * @returns {Promise} Array mit den letzten Aktivitäten
   */
  async getRecentActivities(limit = 10) {
    try {
      // Benutzer laden (für Neuregistrierungen)
      const usersResponse = await userService.getAllUsers();
      const users = usersResponse.data || [];
      
      // Pinnwand-Einträge laden (für neue Einträge und Aktualisierungen)
      const bulletinsResponse = await bulletinService.getAllBulletins();
      const bulletins = bulletinsResponse.data || [];
      
      // Aktivitäten aus Benutzerregistrierungen erstellen
      const userActivities = users.map(user => ({
        type: 'user',
        description: user.userType === 'Arzt' 
          ? 'Neuer Arzt registriert' 
          : user.userType === 'Klinik' 
            ? 'Neue Klinik registriert' 
            : 'Neuer Benutzer registriert',
        user: user.name || user.email || 'Unbenannter Benutzer',
        date: new Date(user.createdAt || user.created || Date.now())
      }));
      
      // Aktivitäten aus Pinnwand-Einträgen erstellen
      const bulletinActivities = bulletins.map(bulletin => {
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
      
      // Alle Aktivitäten zusammenführen
      const allActivities = [...userActivities, ...bulletinActivities];
      
      // Nach Datum sortieren (neueste zuerst)
      allActivities.sort((a, b) => b.date - a.date);
      
      // Auf gewünschte Anzahl begrenzen
      return allActivities.slice(0, limit);
      
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      // Bei einem Fehler ein leeres Array zurückgeben
      return [];
    }
  }
}

export default new DashboardService(); 