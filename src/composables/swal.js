import Swal from 'sweetalert2'

export function showSwal({ title, text, status = 'success' }) {
  return Swal.fire({
    icon: status === 'success' ? 'success' : 'error',
    title,
    text,
  })
}
