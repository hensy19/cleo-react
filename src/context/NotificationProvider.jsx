import { useState, useCallback, useMemo } from 'react';
import NotificationContext from './NotificationContext';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Toast from '../components/common/Toast';
import { useBrowserNotifications } from '../hooks/useBrowserNotifications';
import './NotificationStyles.css';

export default function NotificationProvider({ children }) {
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'primary',
    onConfirm: null,
    onCancel: null,
    confirmText: 'Confirm',
    cancelText: 'Cancel'
  });

  const [toast, setToast] = useState({
    isOpen: false,
    message: '',
    type: 'success',
    duration: 3000
  });

  const showModal = useCallback((options) => {
    setModal({
      ...options,
      isOpen: true,
      confirmText: options.confirmText || 'Confirm',
      cancelText: options.cancelText || 'Cancel',
      type: options.type || 'primary'
    });
  }, []);

  const hideModal = useCallback(() => {
    setModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({
      isOpen: true,
      message,
      type,
      duration
    });
    
    setTimeout(() => {
      setToast(prev => ({ ...prev, isOpen: false }));
    }, duration);
  }, []);

  const { requestPermission, sendNotification, getPermissionStatus } = useBrowserNotifications();

  const contextValue = useMemo(() => ({
    showModal,
    showToast,
    requestBrowserPermission: requestPermission,
    sendBrowserNotification: sendNotification,
    getBrowserPermissionStatus: getPermissionStatus
  }), [showModal, showToast, requestPermission, sendNotification, getPermissionStatus]);

  const handleConfirm = () => {
    if (modal.onConfirm) modal.onConfirm();
    hideModal();
  };

  const handleCancel = () => {
    if (modal.onCancel) modal.onCancel();
    hideModal();
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      
      {/* Global Confirmation Modal */}
      <Modal 
        isOpen={modal.isOpen} 
        onClose={handleCancel}
        title={modal.title}
        size="small"
      >
        <div className="notification-modal-content">
          <p>{modal.message}</p>
          <div className="notification-modal-actions">
            <Button 
              variant="secondary" 
              onClick={handleCancel}
            >
              {modal.cancelText}
            </Button>
            <Button 
              variant={modal.type === 'danger' ? 'danger' : 'primary'} 
              onClick={handleConfirm}
            >
              {modal.confirmText}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Global Toast */}
      {toast.isOpen && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(prev => ({ ...prev, isOpen: false }))}
        />
      )}
    </NotificationContext.Provider>
  );
}
