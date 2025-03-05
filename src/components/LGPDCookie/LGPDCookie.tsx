'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Cookie from 'js-cookie';
import styles from './LGPDCookie.module.scss';


const cookie = Cookie
// Tipos
interface Preferences {
  ad_storage: boolean;
  analytics_storage: boolean;
  measurement_storage: boolean;
  personalization_storage: boolean;
}

interface LGPDBasicProps {
  togglePreferences: () => void;
  handleAccept: () => void;
  handleDeny: () => void;
}

const LGPDMobileBasic = ({
  togglePreferences,
  handleAccept,
}: LGPDBasicProps) => {

  return (
    <>
      <div className={styles["modal-text"]}>
        <Link href='/privacidade'>Privacidade</Link>
      </div>
      <div className={styles["modal-buttons"]}>
        <button
          aria-label='aceitar cookies'
          onClick={handleAccept}
        >
          botao mobile
        </button>

        <button
          className={styles['decline-btn']}
          onClick={togglePreferences}
        >
          <span>Preferências</span>
        </button>
      </div>
    </>
  )
}

// Componente principal
export const LGPDCookie = () => {

  // Estados
  const [preferences, setPreferences] = useState<Preferences>({
    ad_storage: true,
    analytics_storage: true,
    measurement_storage: true,
    personalization_storage: true,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Função para alternar o modal de preferências
  const togglePreferences = useCallback(() => {
    setIsPreferencesOpen((prev) => !prev);
  }, []);

  // Atualizar o estado no DataLayer e Consent Mode
  const updatePreferences = useCallback((updatedPreferences: Preferences) => {
    // Atualizar o GTM DataLayer
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'updateConsent',
      ...Object.fromEntries(
        Object.entries(updatedPreferences).map(([key, value]) => [
          key,
          value ? 'granted' : 'denied',
        ])
      ),
    });

    // Atualizar o Consent Mode
    window.gtag('consent', 'update', {
      ad_storage: updatedPreferences.ad_storage ? 'granted' : 'denied',
      analytics_storage: updatedPreferences.analytics_storage ? 'granted' : 'denied',
      functionality_storage: updatedPreferences.measurement_storage
        ? 'granted'
        : 'denied',
      personalization_storage: updatedPreferences.personalization_storage
        ? 'granted'
        : 'denied',
    });
  }, []);

  // Função para alterar preferências (usada nos switches)
  const handlePreferenceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, checked } = e.target;
      setPreferences((prev) => ({ ...prev, [name]: checked }));
    },
    []
  );

  // Salvar preferências no cookie e dataLayer
  const handleSavePreferences = useCallback(() => {
    cookie.set('lgpd-consent', JSON.stringify(preferences), { expires: 30 });
    updatePreferences(preferences); // Chama a função aqui
    togglePreferences();
    setIsModalOpen(false);
  }, [preferences, togglePreferences, updatePreferences]);

  // Aceitar todas as preferências
  const handleAccept = useCallback(() => {
    const grantedPreferences: Preferences = {
      ad_storage: true,
      analytics_storage: true,
      measurement_storage: true,
      personalization_storage: true,
    };
    setPreferences(grantedPreferences);
    cookie.set('lgpd-consent', JSON.stringify(grantedPreferences), { expires: 30 });
    updatePreferences(grantedPreferences); // Chama a função aqui
    setIsModalOpen(false);
  }, [updatePreferences]);

  // Negar todas as preferências
  const handleDeny = useCallback(() => {
    const deniedPreferences: Preferences = {
      ad_storage: false,
      analytics_storage: false,
      measurement_storage: false,
      personalization_storage: false,
    };
    setPreferences(deniedPreferences);
    cookie.set('lgpd-consent', JSON.stringify(deniedPreferences), { expires: 30 });
    updatePreferences(deniedPreferences); // Chama a função aqui
    setIsModalOpen(false);
  }, [updatePreferences]);

  // Carregar preferências do cookie ao inicializar
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    setIsMobile(isMobile);

    const storedPreferences = cookie.get('lgpd-consent');
    if (!storedPreferences) {
      setIsModalOpen(true);
    } else {
      setPreferences(JSON.parse(storedPreferences));
    }
  }, []);

  if (isMobile) {
    return (
      <div className={`${styles.cookie} ${isModalOpen ? styles.visible : ''}`} aria-hidden={!isModalOpen}>
      {isModalOpen && (
        <div className={`${styles.modal} ${isModalOpen ? styles.fadeIn : styles.fadeOut}`} role="dialog" title='LGPD Cookie Consent' aria-modal="true">
          {!isPreferencesOpen && (
            <LGPDMobileBasic
              handleAccept={handleAccept}
              handleDeny={handleDeny}
              togglePreferences={togglePreferences}
            />
          )}

          {isPreferencesOpen && (
             <div className={`${styles.preferences} ${isPreferencesOpen ? styles.expanded : styles.collapsed}`}>
              <LGPDPreferences
                preferences={preferences}
                handlePreferenceChange={handlePreferenceChange}
                handleSavePreferences={handleSavePreferences}
                togglePreferences={togglePreferences}
              />
            </div>
          )}
        </div>
      )}
    </div>
    )}

  return (
    <div
      className={`${styles.cookie} ${isModalOpen ? styles.visible : ''}`}
      aria-hidden={!isModalOpen}
    >
      <div
        className={`${styles.modal} ${isModalOpen ? styles.fadeIn : styles.fadeOut}`}
        role="dialog"
        aria-modal="true"
      >
        {isPreferencesOpen ? (
          <LGPDPreferences
            preferences={preferences}
            handlePreferenceChange={handlePreferenceChange}
            handleSavePreferences={handleSavePreferences}
            togglePreferences={togglePreferences}
          />
        ) : (
          <LGPDBasic
            togglePreferences={togglePreferences}
            handleAccept={handleAccept}
            handleDeny={handleDeny}
          />
        )}
      </div>
    </div>
  );
};

// Componentes auxiliares
const LGPDPreferences = ({
  preferences,
  handlePreferenceChange,
  handleSavePreferences,
  togglePreferences,
}: {
  preferences: Preferences;
  handlePreferenceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSavePreferences: () => void;
  togglePreferences: () => void;
}) => {
  return (
    <div className={styles['modal-padding']}>
      <p className={styles['preferences-title']}>Preferências</p>
      {Object.entries(preferences).map(([key, value]) => (
        <div key={key} className={styles['switch-preference-option']}>
          <input
            type='checkbox'
            name={key}
            checked={value}
            onChange={handlePreferenceChange}
          />
          <span>Descrição</span>
        </div>
      ))}
      <div className={styles['preferences-buttons']}>
        <button
          className={styles['modal-button']}
          onClick={handleSavePreferences}
        >
          Salvar preferências
        </button>
        <button
          onClick={togglePreferences}
          type="button"
          className={styles['decline-btn']}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

const LGPDBasic = ({
  togglePreferences,
  handleAccept,
  handleDeny,
}: {
  togglePreferences: () => void;
  handleAccept: () => void;
  handleDeny: () => void;
}) => {
  return (
    <div className={styles['modal-padding']}>
      <p className={styles['consent-title']}>título</p>
      <div className={styles['modal-text']}>
        <Link href="/privacidade">Link de privacidade</Link>
        
      </div>
      <div className={styles['modal-buttons']}>
        <button className={styles['decline-btn']} onClick={togglePreferences}>
          Preferências
        </button>
        <button className={styles['decline-btn']} onClick={handleDeny}>
          Não aceitar
        </button>
        <button onClick={handleAccept}>Aceitar preferências</button>
      </div>
    </div>
  );
};
