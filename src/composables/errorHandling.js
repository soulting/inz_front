import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'

export function handleApiError(error, router) {
  const authStore = useAuthStore()

  if (error.response) {
    const { status, data } = error.response

    switch (status) {
      case 400:
        Swal.fire({
          icon: 'error',
          title: 'Błąd',
          text: data?.error || 'Błędne dane.',
        })
        break
      case 401:
        Swal.fire({
          icon: 'error',
          title: 'Sesja wygasła',
          text: 'Zaloguj się ponownie.',
        }).then(() => {
          authStore.piniaLogout()
          router.push('/login')
        })
        break
      case 403:
        Swal.fire({
          icon: 'error',
          title: 'Brak dostępu',
          text: 'Nie masz uprawnień do wykonania tej akcji.',
        })
        break
      case 404:
        Swal.fire({
          icon: 'error',
          title: 'Nie znaleziono',
          text: data?.error || 'Zasób nie istnieje.',
        })
        break
      case 422:
        Swal.fire({
          icon: 'error',
          title: 'Błąd walidacji',
          text: data?.error || 'Niepoprawne hasło.',
        })
        break
      default:
        Swal.fire({
          icon: 'error',
          title: 'Błąd',
          text: data?.error || 'Wystąpił nieoczekiwany błąd.',
        })
        break
    }
  } else if (error.request) {
    console.error('Brak odpowiedzi od serwera:', error.request)
    Swal.fire({
      icon: 'error',
      title: 'Brak odpowiedzi',
      text: 'Serwer nie odpowiada.',
    })
  } else {
    console.error('Błąd Axios:', error.message)
    Swal.fire({
      icon: 'error',
      title: 'Błąd',
      text: 'Wystąpił problem z zapytaniem.',
    })
  }
}
