"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Users, FileText, Send, CheckCircle, AlertTriangle } from "lucide-react";

export function AdminStats() {
  const { data: profiles } = useQuery({
    queryKey: ["admin-profiles-count"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("id");
      if (error) throw error;
      return data;
    },
  });

  const { data: offers } = useQuery({
    queryKey: ["admin-offers-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.from("offers").select("id, statut, created_at, sent_at");
      if (error) throw error;
      return data;
    },
  });

  const { data: offerClauses } = useQuery({
    queryKey: ["admin-offer-clauses-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.from("offer_clauses").select("clause_id, clauses(title)");
      if (error) throw error;
      return data;
    },
  });

  const totalUsers = profiles?.length || 0;
  const totalOffers = offers?.length || 0;
  const envoyees = offers?.filter((o) => o.statut !== "brouillon").length || 0;
  const acceptees = offers?.filter((o) => o.statut === "acceptee").length || 0;
  const tauxEnvoi = totalOffers > 0 ? Math.round((envoyees / totalOffers) * 100) : 0;
  const tauxAcceptation = envoyees > 0 ? Math.round((acceptees / envoyees) * 100) : 0;

  // Weekly chart data (last 8 weeks)
  const weeklyData = (() => {
    const weeks: { label: string; count: number }[] = [];
    for (let i = 7; i >= 0; i--) {
      const start = new Date(Date.now() - (i + 1) * 7 * 86400000);
      const end = new Date(Date.now() - i * 7 * 86400000);
      const count = offers?.filter((o) => {
        const d = new Date(o.created_at || "");
        return d >= start && d < end;
      }).length || 0;
      weeks.push({
        label: `S-${i}`,
        count,
      });
    }
    return weeks;
  })();

  // Top 5 clauses
  const clauseCounts: Record<string, { title: string; count: number }> = {};
  offerClauses?.forEach((oc: any) => {
    const title = oc.clauses?.title || `#${oc.clause_id}`;
    if (!clauseCounts[title]) clauseCounts[title] = { title, count: 0 };
    clauseCounts[title].count++;
  });
  const topClauses = Object.values(clauseCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const totalClauseUses = Object.values(clauseCounts).reduce((s, c) => s + c.count, 0);

  // Alerts
  const now = Date.now();
  const brouillonsVieux = offers?.filter((o) => {
    return o.statut === "brouillon" && (now - new Date(o.created_at || "").getTime()) > 7 * 86400000;
  }).length || 0;
  const sansReponse = offers?.filter((o) => {
    return o.statut === "envoyee" && o.sent_at && (now - new Date(o.sent_at).getTime()) > 15 * 86400000;
  }).length || 0;

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{totalUsers}</p>
              <p className="text-xs text-muted-foreground">Utilisateurs inscrits</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{totalOffers}</p>
              <p className="text-xs text-muted-foreground">Offres créées</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Send className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{tauxEnvoi}%</p>
              <p className="text-xs text-muted-foreground">Taux d'envoi</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold">{tauxAcceptation}%</p>
              <p className="text-xs text-muted-foreground">Taux d'acceptation</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader><CardTitle className="text-sm">Offres créées par semaine</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(213, 52%, 24%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Clauses */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Top 5 clauses les plus utilisées</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Clause</TableHead>
                  <TableHead className="text-right">Utilisations</TableHead>
                  <TableHead className="text-right">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topClauses.map((c) => (
                  <TableRow key={c.title}>
                    <TableCell className="text-sm">{c.title}</TableCell>
                    <TableCell className="text-right text-sm">{c.count}</TableCell>
                    <TableCell className="text-right text-sm">{totalClauseUses > 0 ? Math.round((c.count / totalClauseUses) * 100) : 0}%</TableCell>
                  </TableRow>
                ))}
                {topClauses.length === 0 && (
                  <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">Aucune donnée</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-500" /> Alertes</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200">
              <div>
                <p className="text-sm font-medium text-amber-900">Brouillons anciens ({">"} 7 jours)</p>
                <p className="text-xs text-amber-700">{brouillonsVieux} offre{brouillonsVieux > 1 ? "s" : ""} concernée{brouillonsVieux > 1 ? "s" : ""}</p>
              </div>
              <Badge variant="outline" className="text-amber-700 border-amber-300">{brouillonsVieux}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 border border-orange-200">
              <div>
                <p className="text-sm font-medium text-orange-900">Sans réponse ({">"} 15 jours)</p>
                <p className="text-xs text-orange-700">{sansReponse} offre{sansReponse > 1 ? "s" : ""} concernée{sansReponse > 1 ? "s" : ""}</p>
              </div>
              <Badge variant="outline" className="text-orange-700 border-orange-300">{sansReponse}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
