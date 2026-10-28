// Export utilities for LifePilot AI: iCalendar (.ics), Markdown, and Plain text

// Generate .ics calendar file for upcoming tasks
export function exportToICS(tasks, planTitle = 'LifePilot Plan') {
  const datedTasks = tasks.filter((t) => t.deadline);
  if (datedTasks.length === 0) {
    alert('No tasks with specific deadlines found to export to calendar.');
    return;
  }

  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//LifePilot AI//Action Planner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  const now = new Date()
    .toISOString()
    .replace(/[-:]/g, '')
    .split('.')[0] + 'Z';

  datedTasks.forEach((task, index) => {
    // Parse deadline
    const cleanDate = task.deadline.replace(/[^0-9-]/g, '');
    let dtStart = now;
    if (/^\d{4}-\d{2}-\d{2}$/.test(cleanDate)) {
      dtStart = cleanDate.replace(/-/g, '') + 'T090000';
    }

    const uid = `lifepilot-${Date.now()}-${index}@lifepilot.app`;

    icsContent.push('BEGIN:VEVENT');
    icsContent.push(`UID:${uid}`);
    icsContent.push(`DTSTAMP:${now}`);
    icsContent.push(`DTSTART:${dtStart}`);
    icsContent.push(`SUMMARY:${escapeICS(task.title)}`);
    icsContent.push(
      `DESCRIPTION:${escapeICS(
        (task.description || '') + ` (Priority: ${task.priority})`
      )}`
    );
    icsContent.push(`PRIORITY:${task.priority === 'High' ? 1 : task.priority === 'Medium' ? 5 : 9}`);
    icsContent.push('STATUS:CONFIRMED');
    icsContent.push('END:VEVENT');
  });

  icsContent.push('END:VCALENDAR');

  const blob = new Blob([icsContent.join('\r\n')], {
    type: 'text/calendar;charset=utf-8',
  });
  downloadBlob(blob, `LifePilot-Tasks-${Date.now()}.ics`);
}

function escapeICS(str) {
  return (str || '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

// Download plan as structured Markdown
export function exportToMarkdown(plan, originalText = '') {
  let md = `# LifePilot Action Plan\n\n`;
  md += `**Tagline**: Less Confusion. More Clarity. Better Action.\n`;
  md += `**Generated**: ${new Date().toLocaleString()}\n\n`;

  md += `## 📋 Summary\n${plan.summary}\n\n`;

  if (plan.facts && plan.facts.length > 0) {
    md += `## 📌 Key Facts & Requirements\n`;
    plan.facts.forEach((f) => (md += `- ${f}\n`));
    md += `\n`;
  }

  if (plan.datesAndAmounts && plan.datesAndAmounts.length > 0) {
    md += `## ⏰ Important Dates & Financial Amounts\n`;
    plan.datesAndAmounts.forEach((da) => {
      md += `- **${da.label}**: ${da.value} (${da.type})\n`;
    });
    md += `\n`;
  }

  if (plan.uncertainties && plan.uncertainties.length > 0) {
    md += `## ⚠️ Missing Information & Items Needing Confirmation\n`;
    plan.uncertainties.forEach((u) => (md += `- ${u}\n`));
    md += `\n`;
  }

  if (plan.actionPlan && plan.actionPlan.length > 0) {
    md += `## ✅ Action Checklist\n`;
    plan.actionPlan.forEach((task) => {
      const check = task.status === 'completed' ? '[x]' : '[ ]';
      const deadline = task.deadline ? ` (Due: ${task.deadline})` : '';
      const priority = ` [${task.priority.toUpperCase()}]`;
      md += `- ${check} **${task.title}**${priority}${deadline}\n  - ${task.description}\n`;
    });
    md += `\n`;
  }

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  downloadBlob(blob, `LifePilot-Plan-${Date.now()}.md`);
}

// Copy checklist to clipboard in clean readable format
export async function copyChecklistToClipboard(tasks) {
  let text = `LifePilot Action Checklist:\n\n`;
  tasks.forEach((t) => {
    const check = t.status === 'completed' ? '☑' : '☐';
    const deadline = t.deadline ? ` [Due: ${t.deadline}]` : '';
    text += `${check} ${t.title} (${t.priority} Priority)${deadline}\n   ${t.description}\n`;
  });

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return false;
  }
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
