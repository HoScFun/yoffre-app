import jsPDF from "jspdf";

// ─── Color palette ───
const BLUE: [number, number, number] = [30, 58, 95];
const GRAY_600: [number, number, number] = [107, 114, 128];
const GRAY_400: [number, number, number] = [156, 163, 175];
const GRAY_300: [number, number, number] = [209, 213, 219];
const GRAY_200: [number, number, number] = [229, 231, 235];
const BLACK: [number, number, number] = [26, 26, 26];
const GREEN: [number, number, number] = [34, 197, 94];
const GREEN_DARK: [number, number, number] = [22, 163, 74];

const MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

function formatDateFR(d: Date): string {
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
function formatTimeFR(d: Date): string {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function numberToFrenchWords(n: number): string {
  if (n === 0) return "zéro";
  const units = ["", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"];
  const tens = ["", "", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante", "quatre-vingt", "quatre-vingt"];
  function convertBelow1000(num: number): string {
    if (num === 0) return "";
    if (num < 20) return units[num];
    if (num < 100) {
      const t = Math.floor(num / 10);
      const u = num % 10;
      if (t === 7 || t === 9) return tens[t] + "-" + units[10 + u];
      if (u === 0) return tens[t] + (t === 8 ? "s" : "");
      if (u === 1 && t !== 8) return tens[t] + " et un";
      return tens[t] + "-" + units[u];
    }
    const h = Math.floor(num / 100);
    const rest = num % 100;
    let result = h === 1 ? "cent" : units[h] + " cent";
    if (rest === 0 && h > 1) result += "s";
    else if (rest > 0) result += " " + convertBelow1000(rest);
    return result;
  }
  const parts: string[] = [];
  if (n >= 1000000) {
    const millions = Math.floor(n / 1000000);
    parts.push(millions === 1 ? "un million" : convertBelow1000(millions) + " millions");
    n %= 1000000;
  }
  if (n >= 1000) {
    const thousands = Math.floor(n / 1000);
    parts.push(thousands === 1 ? "mille" : convertBelow1000(thousands) + " mille");
    n %= 1000;
  }
  if (n > 0) parts.push(convertBelow1000(n));
  return parts.join(" ").trim();
}

export function generateOfferPdf(offer: any, offerClauses: any[], vendorResponse?: any | null) {
  const doc = new jsPDF();
  
  // PDF metadata
  doc.setProperties({
    title: `Offre d'achat immobilier — ${offer.bien_adresse || ''}`,
    subject: 'Offre d\'achat immobilier',
    author: 'Yoffre',
    creator: 'yoffre.fr',
  });

  const margin = 20;
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const mw = pw - margin * 2;
  let y = 0;
  const now = new Date();
  const offerId = offer.id || "000000";
  const refShort = String(offerId).substring(0, 6).toUpperCase();
  const validiteJours = offer.delai_validite_jours || 10;
  const expDate = new Date(Date.now() + validiteJours * 24 * 60 * 60 * 1000);
  const prix = Number(offer.bien_prix_propose);
  let sectionNum = 0;

  // ─── Helpers ───
  const newPageIfNeeded = (needed: number) => {
    if (y + needed > ph - 20) {
      doc.addPage();
      y = 20;
      addMiniHeader();
    }
  };

  const addMiniHeader = () => {
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...BLUE);
    doc.text("YOFFRE", margin, 14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GRAY_600);
    const refText = `Réf. ${refShort}`;
    doc.text(refText, pw - margin - doc.getTextWidth(refText), 14);
    doc.setDrawColor(...BLUE);
    doc.setLineWidth(0.3);
    doc.line(margin, 17, pw - margin, 17);
    y = 24;
  };

  const addSectionHeader = (title: string) => {
    sectionNum++;
    newPageIfNeeded(18);
    y += 6;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GRAY_600);
    doc.text(`${sectionNum} ——— ${title}`, margin, y);
    y += 3;
    doc.setDrawColor(...GRAY_200);
    doc.setLineWidth(0.2);
    doc.line(margin, y, pw - margin, y);
    y += 6;
  };

  const addRow = (label: string, value: string) => {
    if (!value) return;
    newPageIfNeeded(7);
    const col1 = margin;
    const col2 = margin + 55;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...GRAY_600);
    doc.text(label, col1, y);
    doc.setTextColor(...BLACK);
    const valLines = doc.splitTextToSize(value, mw - 55);
    doc.text(valLines[0], col2, y);
    y += 5;
    for (let i = 1; i < valLines.length; i++) {
      newPageIfNeeded(6);
      doc.text(valLines[i], col2, y);
      y += 5;
    }
  };

  const addWrappedText = (text: string, fontSize = 9, bold = false, color: [number, number, number] = BLACK, italic = false) => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", bold && italic ? "bolditalic" : bold ? "bold" : italic ? "italic" : "normal");
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, mw);
    newPageIfNeeded(lines.length * fontSize * 0.42 + 2);
    doc.text(lines, margin, y);
    y += lines.length * fontSize * 0.42 + 2;
  };

  const drawBox = (x: number, bY: number, w: number, h: number, fillColor: [number, number, number], borderColor?: [number, number, number]) => {
    doc.setFillColor(...fillColor);
    doc.roundedRect(x, bY, w, h, 2, 2, "F");
    if (borderColor) {
      doc.setDrawColor(...borderColor);
      doc.setLineWidth(0.3);
      doc.roundedRect(x, bY, w, h, 2, 2, "S");
    }
  };

  // ═══════════════════════════════════════════
  // PAGE DE GARDE
  // ═══════════════════════════════════════════
  y = 20;

  // Header bar
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...BLUE);
  doc.text("YOFFRE", margin, y);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GRAY_400);
  const siteText = "yoffre.fr";
  doc.text(siteText, pw - margin - doc.getTextWidth(siteText), y);
  y += 5;
  doc.setDrawColor(...BLUE);
  doc.setLineWidth(2);
  doc.line(margin, y, pw - margin, y);

  // Central block
  y = 80;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GRAY_600);
  const cat = "OFFRE D'ACHAT IMMOBILIER";
  doc.text(cat, (pw - doc.getTextWidth(cat)) / 2, y);

  y += 14;
  doc.setFontSize(26);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...BLUE);
  const mainTitle = "OFFRE D'ACHAT";
  doc.text(mainTitle, (pw - doc.getTextWidth(mainTitle)) / 2, y);

  y += 12;
  doc.setFontSize(13);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...BLACK);
  const addrLines = doc.splitTextToSize(offer.bien_adresse || "", mw - 40);
  addrLines.forEach((line: string) => {
    doc.text(line, (pw - doc.getTextWidth(line)) / 2, y);
    y += 7;
  });

  y += 6;
  doc.setDrawColor(...GRAY_200);
  doc.setLineWidth(0.3);
  doc.line(pw / 2 - 30, y, pw / 2 + 30, y);

  // Identity block
  y += 12;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...BLACK);
  const presBy = `Présentée par : ${offer.acheteur_nom}`;
  doc.text(presBy, (pw - doc.getTextWidth(presBy)) / 2, y);
  y += 7;
  doc.setFontSize(10);
  doc.setTextColor(...GRAY_600);
  const dateLine = `En date du : ${formatDateFR(now)} à ${formatTimeFR(now)}`;
  doc.text(dateLine, (pw - doc.getTextWidth(dateLine)) / 2, y);

  // Legal disclaimer box at bottom
  const boxY = ph - 65;
  drawBox(margin, boxY, mw, 30, [248, 250, 252], [229, 231, 235]);
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(...GRAY_600);
  const disclaimerText = "Ce document a été généré conformément à l'article 1113 du Code civil relatif à la formation du contrat par offre et acceptation, et à la loi n°2000-230 du 13 mars 2000 portant adaptation du droit de la preuve aux technologies de l'information.";
  const dLines = doc.splitTextToSize(disclaimerText, mw - 12);
  doc.text(dLines, margin + 6, boxY + 7);

  // Bottom right branding
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GRAY_300);
  const brand = "Fait avec Yoffre — yoffre.fr";
  doc.text(brand, pw - margin - doc.getTextWidth(brand), ph - 12);

  // ═══════════════════════════════════════════
  // CONTENT PAGES
  // ═══════════════════════════════════════════
  doc.addPage();
  addMiniHeader();

  // SECTION 1 — L'ACQUÉREUR
  addSectionHeader("L'ACQUÉREUR");
  addRow("Nom complet", offer.acheteur_nom);
  addRow("Adresse", offer.acheteur_adresse || "Non renseignée");
  addRow("Email", offer.acheteur_email);
  addRow("Téléphone", offer.acheteur_telephone || "Non renseigné");

  // SECTION 2 — LE VENDEUR
  addSectionHeader("LE VENDEUR");
  addRow("Nom complet", offer.vendeur_nom);
  addRow("Adresse", offer.vendeur_adresse || "Non renseignée");
  addRow("Email", offer.vendeur_email);

  // SECTION 3 — LE BIEN IMMOBILIER
  addSectionHeader("LE BIEN IMMOBILIER");
  addRow("Adresse", offer.bien_adresse);
  if (offer.bien_type) addRow("Type de bien", offer.bien_type);
  addRow("Prix proposé", `${prix.toLocaleString("fr-FR")} € (${numberToFrenchWords(Math.round(prix))} euros)`);
  addRow("Dépôt de garantie indicatif", `${Math.round(prix * 0.1).toLocaleString("fr-FR")} €`);
  y += 1;
  addWrappedText("Le dépôt de garantie est donné à titre indicatif conformément à l'article 1590 du Code civil. Son montant définitif sera fixé au compromis.", 8, false, GRAY_600, true);

  // SECTION 4 — MODE DE FINANCEMENT
  addSectionHeader("MODE DE FINANCEMENT");
  if (offer._financement === "pret") {
    addRow("Montant du prêt", `${(offer._clauseValues?.valeur_montant_pret || 0).toLocaleString("fr-FR")} €`);
    addRow("Taux maximum", `${offer._clauseValues?.valeur_taux_max || 0} %`);
    addRow("Durée", `${offer._clauseValues?.valeur_duree_pret || 0} mois`);
    if (offer._financement_banque) addRow("Banque visée", offer._financement_banque);
    y += 3;
    newPageIfNeeded(16);
    drawBox(margin, y, mw, 12, [220, 252, 231], [187, 247, 208]);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(22, 101, 52);
    doc.text("Condition suspensive d'obtention de prêt applicable — Art. L.313-41 Code de la consommation (Loi Scrivener)", margin + 4, y + 7);
    y += 16;
  } else if (offer._financement === "comptant") {
    addWrappedText("Acquisition sans recours à un emprunt immobilier.", 9, false, BLACK);
  } else {
    addWrappedText("Non précisé.", 9, false, GRAY_600, true);
  }

  // SECTION 5 — AGENT (if applicable)
  if (offer.agent_immobilier && offer._agent) {
    addSectionHeader("L'AGENT IMMOBILIER");
    addRow("Nom", offer._agent.nom);
    addRow("Agence", offer._agent.agence);
    addRow("Email", offer._agent.email);
    if (offer._agent.carte_t) addRow("Carte T", offer._agent.carte_t);
    y += 1;
    const carteRef = offer._agent.carte_t ? ` — Carte T n°${offer._agent.carte_t}` : "";
    addWrappedText(`Mandataire habilité conformément à la loi n°70-9 du 2 janvier 1970 (Loi Hoguet)${carteRef}`, 8, false, GRAY_600, true);
  }

  // SECTION 6 — NOTAIRE (if applicable)
  if (offer.notaire_email) {
    addSectionHeader("LE NOTAIRE");
    addWrappedText(`Notaire désigné par l'acquéreur : ${offer.notaire_email}`, 9, false, BLACK);
    addWrappedText("Copie de la présente offre lui a été adressée simultanément à l'acquéreur.", 9, false, BLACK);
  }

  // SECTION 7 — CONDITIONS DE L'OFFRE
  addSectionHeader("CONDITIONS DE L'OFFRE");
  y += 2;
  newPageIfNeeded(30);
  const condText = `La présente offre est valable ${validiteJours} jours à compter de sa réception par le vendeur, soit jusqu'au ${formatDateFR(expDate)} à ${formatTimeFR(expDate)}.\n\nPassé ce délai sans réponse écrite du vendeur, la présente offre sera réputée refusée de plein droit, conformément à l'article 1117 du Code civil.`;
  const condLines = doc.splitTextToSize(condText, mw - 12);
  const condH = condLines.length * 4 + 10;
  drawBox(margin, y, mw, condH, [239, 246, 255], [191, 219, 254]);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...BLACK);
  doc.text(condLines, margin + 6, y + 7);
  y += condH + 4;

  // SECTION 8 — MESSAGE (if any)
  if (offer._message_vendeur && offer._message_vendeur.trim().length > 0) {
    addSectionHeader("MESSAGE DE L'ACQUÉREUR");
    addWrappedText("Message adressé au vendeur :", 8, false, GRAY_600, true);
    y += 2;
    newPageIfNeeded(20);
    const msgLines = doc.splitTextToSize(offer._message_vendeur, mw - 14);
    const msgH = msgLines.length * 4 + 10;
    drawBox(margin, y, mw, msgH, [248, 250, 252]);
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(...BLACK);
    doc.text(msgLines, margin + 7, y + 7);
    y += msgH + 4;
  }

  // SECTION 9 — CONDITIONS SUSPENSIVES
  if (offerClauses.length > 0) {
    addSectionHeader("CONDITIONS SUSPENSIVES");
    addWrappedText("Les conditions suspensives suivantes sont stipulées dans l'intérêt exclusif de l'acquéreur, conformément aux articles 1304 et suivants du Code civil.", 9, false, GRAY_600, true);
    y += 3;

    offerClauses.forEach((oc: any, i: number) => {
      newPageIfNeeded(30);
      const clauseTitle = oc.clauses?.title || `Clause #${oc.clause_id}`;
      // Title
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...BLUE);
      doc.text(`${i + 1}. ${clauseTitle}`, margin, y);
      y += 6;

      // Description in box
      let desc = oc.clauses?.description || "";
      if (oc.valeur_montant_pret) desc = desc.replace("[MONTANT]", `${oc.valeur_montant_pret.toLocaleString("fr-FR")} €`);
      if (oc.valeur_taux_max) desc = desc.replace("[TAUX]", `${oc.valeur_taux_max}%`);
      if (oc.valeur_duree_pret) desc = desc.replace("[DUREE]", `${oc.valeur_duree_pret} mois`);
      if (desc) {
        const descLines = doc.splitTextToSize(desc, mw - 14);
        const descH = descLines.length * 3.8 + 10;
        newPageIfNeeded(descH + 8);
        drawBox(margin, y, mw, descH, [248, 250, 252]);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...BLACK);
        doc.text(descLines, margin + 7, y + 6);
        y += descH + 2;
      }

      // Base légale aligned right
      if (oc.clauses?.base_legale) {
        doc.setFontSize(7);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(...GRAY_600);
        const blText = oc.clauses.base_legale;
        doc.text(blText, pw - margin - doc.getTextWidth(blText), y);
        y += 5;
      }
      y += 3;
    });
  }

  // SECTION 10 — DÉCLARATION DE L'ACQUÉREUR
  addSectionHeader("DÉCLARATION DE L'ACQUÉREUR");
  y += 2;
  newPageIfNeeded(50);
  const declText = `Je soussigné(e) ${offer.acheteur_nom}, déclare :\n\n— Avoir pris connaissance de l'ensemble des conditions de la présente offre d'achat,\n— Que les informations communiquées sont exactes,\n— Que la présente offre m'engage juridiquement dès son acceptation par le vendeur,\n— Avoir été informé(e) que ce document a été généré à titre informatif et ne constitue pas un conseil juridique personnalisé.\n\nFait le ${formatDateFR(now)} à ${formatTimeFR(now)} — Document horodaté électroniquement par Yoffre.`;
  const declLines = doc.splitTextToSize(declText, mw - 14);
  const declH = declLines.length * 3.8 + 12;
  // Border box
  doc.setDrawColor(...BLUE);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, mw, declH, 2, 2, "S");
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...BLACK);
  doc.text(declLines, margin + 7, y + 8);
  y += declH + 6;

  // ═══════════════════════════════════════════
  // VENDOR ACCEPTANCE
  // ═══════════════════════════════════════════
  if (vendorResponse && vendorResponse.decision === "acceptee") {
    doc.addPage();
    addMiniHeader();
    y += 10;
    const acceptText = `Le vendeur ${vendorResponse.vendeur_nom || offer.vendeur_nom} a accepté la présente offre d'achat en date du ${vendorResponse.responded_at ? formatDateFR(new Date(vendorResponse.responded_at)) : "N/A"} à ${vendorResponse.responded_at ? formatTimeFR(new Date(vendorResponse.responded_at)) : "N/A"}.\n\nAdresse IP d'enregistrement : ${vendorResponse.ip_address || "N/A"}\nRéférence horodatage : ${offerId}\n\nCette acceptation forme un contrat au sens de l'article 1113 du Code civil. Les parties sont invitées à régulariser un compromis de vente dans les meilleurs délais.`;
    const aLines = doc.splitTextToSize(acceptText, mw - 16);
    const aH = aLines.length * 4 + 20;
    drawBox(margin, y, mw, aH, [220, 252, 231], [34, 197, 94]);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...GREEN_DARK);
    doc.text("✓ OFFRE ACCEPTÉE", margin + 8, y + 12);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...BLACK);
    doc.text(aLines, margin + 8, y + 22);
    y += aH + 10;
  } else if (vendorResponse && vendorResponse.decision === "refusee") {
    doc.addPage();
    addMiniHeader();
    y += 10;
    drawBox(margin, y, mw, 35, [254, 226, 226], [239, 68, 68]);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(220, 38, 38);
    doc.text("✗ OFFRE REFUSÉE", margin + 8, y + 12);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...BLACK);
    doc.text(`Refusée par : ${vendorResponse.vendeur_nom || "N/A"}`, margin + 8, y + 22);
    if (vendorResponse.responded_at) {
      doc.text(`Date : ${new Date(vendorResponse.responded_at).toISOString()}`, margin + 8, y + 28);
    }
    y += 45;
  }

  // ═══════════════════════════════════════════
  // FOOTERS (skip cover page = page 1)
  // ═══════════════════════════════════════════
  const totalPages = doc.getNumberOfPages();
  for (let i = 2; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    // Left
    doc.setTextColor(...GRAY_600);
    doc.text(`Réf. ${refShort} — Confidentiel`, margin, ph - 10);
    // Center
    const pageText = `Page ${i - 1} / ${totalPages - 1}`;
    doc.text(pageText, (pw - doc.getTextWidth(pageText)) / 2, ph - 10);
    // Right
    doc.setTextColor(...GRAY_300);
    const ftBrand = "Fait avec Yoffre — yoffre.fr";
    doc.text(ftBrand, pw - margin - doc.getTextWidth(ftBrand), ph - 10);
  }

  return doc;
}

export function downloadOfferPdf(offer: any, offerClauses: any[], vendorResponse?: any | null) {
  const doc = generateOfferPdf(offer, offerClauses, vendorResponse);
  doc.save(`offre-${offer.bien_adresse?.replace(/\s+/g, "-").substring(0, 30) || "yoffre"}.pdf`);
}
