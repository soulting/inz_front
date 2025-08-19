import Swal from 'sweetalert2'

// Toast bez przycisku - sukces
export function showSuccessToast(text = 'Operacja zakończona pomyślnie', title = 'Sukces!') {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    timer: 2000,
    showConfirmButton: false,
    toast: true,
    position: 'top-end',
  })
}

// Toast bez przycisku - błąd
export function showErrorToast(text = 'Wystąpił błąd', title = 'Błąd!') {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    timer: 3000,
    showConfirmButton: false,
    toast: true,
    position: 'top-end',
  })
}

// Popup z przyciskiem - sukces
export function showSuccessPopup(text = 'Operacja zakończona pomyślnie', title = 'Sukces!') {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonText: 'OK',
    confirmButtonColor: '#28a745',
  })
}

// Popup z przyciskiem - błąd
export function showErrorPopup(text = 'Wystąpił błąd', title = 'Błąd!') {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonText: 'OK',
    confirmButtonColor: '#dc3545',
  })
}

// Uniwersalna funkcja (dla kompatybilności wstecznej)
export function showSwal({ title, text, status = 'success', showButton = false, isToast = false }) {
  const config = {
    icon: status === 'success' ? 'success' : 'error',
    title: title || (status === 'success' ? 'Sukces!' : 'Błąd!'),
    text: text || (status === 'success' ? 'Operacja zakończona pomyślnie' : 'Wystąpił błąd'),
  }

  if (isToast) {
    config.toast = true
    config.position = 'top-end'
    config.timer = status === 'success' ? 2000 : 3000
    config.showConfirmButton = false
  } else if (!showButton) {
    config.timer = status === 'success' ? 2000 : 3000
    config.showConfirmButton = false
  } else {
    config.confirmButtonText = 'OK'
    config.confirmButtonColor = status === 'success' ? '#28a745' : '#dc3545'
  }

  return Swal.fire(config)
}
