function formatBrief(fields) {
  const input = (key) => String(fields[key] ?? '').trim();
  const service = input('service');
  const location = input('location');
  const scope = input('scope');
  if (!['Property development', 'Property renovation'].includes(service) || !location || !scope) return '';
  const details = [['Service', service], ['Property location', location], ['Project stage', input('stage')], ['Timing', input('timing')], ['Budget range', input('budget')]];
  return ['PROJECT BRIEF', 'Atlantic Business Group', '', ...details.filter(([, value]) => value).map(([label, value]) => label + ': ' + value), '', 'What I have in mind', scope].join('\n');
}
const form = document.querySelector('#project-brief');
const summary = document.querySelector('#brief-summary');
const status = document.querySelector('#brief-status');
const copy = document.querySelector('#brief-copy');
const download = document.querySelector('#brief-download');
const storageKey = 'atlantic-project-brief-v1';
const inputs = [...form.querySelectorAll('[name]')];
const selected = new URLSearchParams(location.search).get('service');
const services = {'development': 'Property development', 'renovation': 'Property renovation'};

function storage(action, text) {
  try {
    if (action === 'read') return JSON.parse(localStorage.getItem(storageKey) || '{}');
    if (action === 'write') localStorage.setItem(storageKey, JSON.stringify(text));
    if (action === 'clear') localStorage.removeItem(storageKey);
  } catch {
    return {};
  }
}

const draft = storage('read') || {};
for (const input of inputs) {
  if (typeof draft[input.name] === 'string') input.value = draft[input.name];
}
if (Object.hasOwn(services, selected)) form.elements.service.value = services[selected];

function refresh(save = false) {
  const fields = Object.fromEntries(new FormData(form));
  const complete = formatBrief(fields);
  summary.value = complete;
  copy.disabled = download.disabled = !complete;
  if (save) storage('write', fields);
}

form.addEventListener('submit', event => event.preventDefault());
form.addEventListener('input', () => { refresh(true); status.textContent = ''; });
document.querySelector('#brief-clear').addEventListener('click', () => {
  form.reset();
  storage('clear');
  refresh();
  status.textContent = 'Draft cleared.';
  form.elements.service.focus();
});
copy.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(summary.value);
    status.textContent = 'Project brief copied.';
  } catch {
    summary.focus();
    summary.select();
    status.textContent = 'The brief is selected. Use your device’s Copy command.';
  }
});
download.addEventListener('click', () => {
  const blob = new Blob([summary.value], {type: 'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Atlantic-Project-Brief.txt';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  status.textContent = 'Project brief downloaded.';
});
refresh();
