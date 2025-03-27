const validateForm = (): boolean => {
  // Reset error state
  formErrors.value = {
    title: '',
    content: '',
    name: '',
    email: '',
    messageType: '',
    privacyPolicyAccepted: ''
  };
  
  let isValid = true;
  
  // Validate title
  if (!formData.value.title || formData.value.title.trim() === '') {
    formErrors.value.title = 'Bitte geben Sie einen Titel ein';
    isValid = false;
  } else if (formData.value.title.length > 100) {
    formErrors.value.title = 'Der Titel darf nicht länger als 100 Zeichen sein';
    isValid = false;
  }
  
  // Validate content
  if (!formData.value.content || formData.value.content.trim() === '') {
    formErrors.value.content = 'Bitte geben Sie einen Inhalt ein';
    isValid = false;
  } else if (formData.value.content.length > 1000) {
    formErrors.value.content = 'Der Inhalt darf nicht länger als 1000 Zeichen sein';
    isValid = false;
  }
  
  // Validate name
  if (!formData.value.name || formData.value.name.trim() === '') {
    formErrors.value.name = 'Bitte geben Sie Ihren Namen ein';
    isValid = false;
  }
  
  // Validate email with regex
  if (!formData.value.email || formData.value.email.trim() === '') {
    formErrors.value.email = 'Bitte geben Sie Ihre E-Mail-Adresse ein';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    formErrors.value.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
    isValid = false;
  }
  
  // Validate message type
  if (!formData.value.messageType || formData.value.messageType.trim() === '') {
    formErrors.value.messageType = 'Bitte wählen Sie einen Nachrichtentyp aus';
    isValid = false;
  }
  
  // Extra validation for job listings (Angebot/Gesuch)
  if (formData.value.messageType === 'Angebot' || formData.value.messageType === 'Gesuch') {
    // Validate specialty for job listings
    if (!formData.value.specialty || formData.value.specialty.trim() === '') {
      formErrors.value.specialty = 'Bitte wählen Sie ein Fachgebiet aus';
      isValid = false;
    }
    
    // Validate start date for job listings
    if (!formData.value.startDate) {
      formErrors.value.startDate = 'Bitte geben Sie ein Verfügbarkeitsdatum an';
      isValid = false;
    } else {
      // Check if startDate is a valid date and not in the past
      const startDate = new Date(formData.value.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to beginning of day for fair comparison
      
      if (isNaN(startDate.getTime())) {
        formErrors.value.startDate = 'Bitte geben Sie ein gültiges Datum ein';
        isValid = false;
      } else if (startDate < today) {
        formErrors.value.startDate = 'Das Datum darf nicht in der Vergangenheit liegen';
        isValid = false;
      }
    }
  }
  
  // Validate privacy policy acceptance
  if (!formData.value.privacyPolicyAccepted) {
    formErrors.value.privacyPolicyAccepted = 'Bitte akzeptieren Sie die Datenschutzerklärung';
    isValid = false;
  }
  
  return isValid;
}; 