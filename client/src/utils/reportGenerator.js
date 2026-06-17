import jsPDF from 'jspdf'
import { format } from 'date-fns'

export function generateDoctorReport(data) {
  const { profile, vitals, medications, wellScores, dateRange } = data
  
  const doc = new jsPDF()
  const pageW = doc.internal.pageSize.getWidth()
  let y = 20

  // Header
  doc.setFillColor(99, 102, 241)
  doc.rect(0, 0, pageW, 40, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.text('WellSync Health Report', 20, 22)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Generated: ${format(new Date(), 'dd MMM yyyy, HH:mm')}`, 20, 34)
  
  y = 55
  doc.setTextColor(15, 23, 42)

  // Patient Info
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('Patient Information', 20, y)
  y += 8
  doc.setDrawColor(226, 232, 240)
  doc.line(20, y, pageW - 20, y)
  y += 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  const patientInfo = [
    ['Name', profile?.name || 'N/A'],
    ['Age', profile?.age ? `${profile.age} years` : 'N/A'],
    ['Gender', profile?.gender || 'N/A'],
    ['Condition', profile?.condition_profile?.condition || 'None reported'],
    ['Report Period', dateRange || 'Last 30 days'],
  ]
  patientInfo.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold')
    doc.text(`${label}:`, 20, y)
    doc.setFont('helvetica', 'normal')
    doc.text(value, 70, y)
    y += 7
  })

  y += 5

  // WellScore Summary
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('WellScore Summary (Last 30 Days)', 20, y)
  y += 8
  doc.line(20, y, pageW - 20, y)
  y += 8

  if (wellScores?.length > 0) {
    const avg = Math.round(wellScores.reduce((a, s) => a + s.score, 0) / wellScores.length)
    const max = Math.max(...wellScores.map(s => s.score))
    const min = Math.min(...wellScores.map(s => s.score))
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.text(`Average Score: ${avg}/100`, 20, y); y += 7
    doc.text(`Peak Score: ${max}/100`, 20, y); y += 7
    doc.text(`Lowest Score: ${min}/100`, 20, y); y += 7
    doc.text(`Days Tracked: ${wellScores.length}`, 20, y); y += 10
    
    // Latest briefing
    if (wellScores[0]?.ai_briefing) {
      doc.setFont('helvetica', 'bold')
      doc.text('Latest AI Briefing:', 20, y); y += 7
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      const briefLines = doc.splitTextToSize(wellScores[0].ai_briefing, pageW - 40)
      doc.text(briefLines, 20, y)
      y += briefLines.length * 5 + 5
    }
  } else {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.text('No WellScore data available for this period.', 20, y)
    y += 10
  }

  // Vitals
  if (y > 240) { doc.addPage(); y = 20 }
  
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(15, 23, 42)
  doc.text('Vital Signs Log', 20, y)
  y += 8
  doc.line(20, y, pageW - 20, y)
  y += 8

  if (vitals?.length > 0) {
    // Table headers
    doc.setFillColor(248, 250, 252)
    doc.rect(20, y - 3, pageW - 40, 9, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(100, 116, 139)
    doc.text('Date', 22, y + 3)
    doc.text('Type', 60, y + 3)
    doc.text('Value', 110, y + 3)
    doc.text('Status', 145, y + 3)
    y += 12

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(15, 23, 42)
    vitals.slice(0, 20).forEach((v, i) => {
      if (y > 260) { doc.addPage(); y = 20 }
      if (i % 2 === 0) {
        doc.setFillColor(248, 250, 252)
        doc.rect(20, y - 3, pageW - 40, 8, 'F')
      }
      doc.text(format(new Date(v.logged_at), 'dd MMM'), 22, y + 2)
      doc.text(v.vital_type || '', 60, y + 2)
      doc.text(`${v.value} ${v.unit || ''}`, 110, y + 2)
      if (v.ai_flag) {
        doc.setTextColor(v.ai_flag === 'urgent' ? 220 : v.ai_flag === 'warning' ? 217 : 22,
                         v.ai_flag === 'urgent' ? 38 : v.ai_flag === 'warning' ? 119 : 197,
                         v.ai_flag === 'urgent' ? 38 : v.ai_flag === 'warning' ? 6 : 94)
        doc.text(v.ai_flag.toUpperCase(), 145, y + 2)
        doc.setTextColor(15, 23, 42)
      }
      y += 8
    })
  } else {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.text('No vital readings recorded in this period.', 20, y)
    y += 10
  }

  y += 5

  // Medications
  if (y > 240) { doc.addPage(); y = 20 }
  
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('Medications', 20, y)
  y += 8
  doc.line(20, y, pageW - 20, y)
  y += 8

  if (medications?.length > 0) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    medications.forEach((med, i) => {
      if (y > 260) { doc.addPage(); y = 20 }
      if (i % 2 === 0) {
        doc.setFillColor(248, 250, 252)
        doc.rect(20, y - 3, pageW - 40, 8, 'F')
      }
      doc.text(`${med.name} — ${med.dosage} (${med.frequency})`, 22, y + 2)
      y += 8
    })
  } else {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.text('No medications logged.', 20, y)
    y += 10
  }

  // Footer
  const totalPages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(8)
    doc.setTextColor(148, 163, 184)
    doc.text('This report is generated by WellSync for informational purposes only. Not a substitute for professional medical advice.', 20, 285)
    doc.text(`Page ${i} of ${totalPages}`, pageW - 30, 285)
  }

  doc.save(`WellSync_Report_${format(new Date(), 'yyyy-MM-dd')}.pdf`)
}

export function exportToCSV(data, filename) {
  const rows = [Object.keys(data[0])]
  data.forEach(row => rows.push(Object.values(row).map(v => JSON.stringify(v ?? ''))))
  const csv = rows.map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}_${new Date().toISOString().slice(0,10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
