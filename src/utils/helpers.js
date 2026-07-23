export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

export const formatDateTime = (date) =>
  new Date(date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

export const truncate = (text, length = 100) =>
  text && text.length > length ? `${text.slice(0, length)}...` : text;
