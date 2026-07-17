"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface ClauseRow {
  id: number;
  title: string;
  description: string;
  base_legale: string | null;
  profils: string[] | null;
  obligatoire: boolean | null;
  ordre: number | null;
  tier: string | null;
  active: boolean | null;
}

const PROFIL_OPTIONS = [
  { value: "residence_principale", label: "Résidence principale" },
  { value: "investissement_locatif", label: "Investissement locatif" },
  { value: "professionnel", label: "Professionnel" },
];

const emptyClause = {
  title: "", description: "", base_legale: "", profils: [] as string[],
  obligatoire: false, ordre: 0, tier: "free", active: true,
};

export function AdminClauses() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<ClauseRow | null>(null);
  const [form, setForm] = useState(emptyClause);
  const [deleteTarget, setDeleteTarget] = useState<ClauseRow | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [tierConfirm, setTierConfirm] = useState<ClauseRow | null>(null);
  const [activeConfirm, setActiveConfirm] = useState<ClauseRow | null>(null);

  const { data: clauses, isLoading } = useQuery({
    queryKey: ["admin-clauses"],
    queryFn: async () => {
      const { data, error } = await supabase.from("clauses").select("*").order("ordre");
      if (error) throw error;
      return data as ClauseRow[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: typeof form & { id?: number }) => {
      const record = {
        title: payload.title,
        description: payload.description,
        base_legale: payload.base_legale || null,
        profils: payload.profils.length > 0 ? payload.profils : null,
        obligatoire: payload.obligatoire,
        ordre: payload.ordre,
        tier: payload.tier,
        active: payload.active,
      };
      if (payload.id) {
        const { error } = await supabase.from("clauses").update(record).eq("id", payload.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("clauses").insert(record);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-clauses"] });
      toast({ title: "Clause enregistrée ✓" });
      setDrawerOpen(false);
      setEditing(null);
    },
    onError: (e: any) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("clauses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-clauses"] });
      toast({ title: "Clause supprimée" });
      setDeleteTarget(null);
      setDeleteConfirm("");
    },
  });

  const toggleTier = useMutation({
    mutationFn: async ({ id, tier }: { id: number; tier: string }) => {
      const { error } = await supabase.from("clauses").update({ tier }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-clauses"] }); setTierConfirm(null); },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, active }: { id: number; active: boolean }) => {
      const { error } = await supabase.from("clauses").update({ active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-clauses"] }); setActiveConfirm(null); },
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyClause);
    setDrawerOpen(true);
  };

  const openEdit = (c: ClauseRow) => {
    setEditing(c);
    setForm({
      title: c.title, description: c.description, base_legale: c.base_legale || "",
      profils: c.profils || [], obligatoire: !!c.obligatoire, ordre: c.ordre || 0,
      tier: c.tier || "free", active: c.active !== false,
    });
    setDrawerOpen(true);
  };

  const handleSave = () => {
    saveMutation.mutate(editing ? { ...form, id: editing.id } : form);
  };

  const toggleProfil = (p: string) => {
    setForm((f) => ({
      ...f,
      profils: f.profils.includes(p) ? f.profils.filter((x) => x !== p) : [...f.profils, p],
    }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Bibliothèque de clauses</h2>
        <Button onClick={openCreate} size="sm"><Plus className="h-4 w-4 mr-1" /> Ajouter une clause</Button>
      </div>

      <div className="rounded-md border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Ordre</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead>Profils</TableHead>
              <TableHead>Base légale</TableHead>
              <TableHead className="w-24">Tier</TableHead>
              <TableHead className="w-20">Active</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Chargement...</TableCell></TableRow>
            ) : clauses?.map((c) => (
              <TableRow key={c.id} className={c.active === false ? "opacity-50" : ""}>
                <TableCell className="font-mono text-xs">{c.ordre}</TableCell>
                <TableCell className="font-medium text-sm">{c.title}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{c.profils?.join(", ") || "Tous"}</TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">{c.base_legale}</TableCell>
                <TableCell>
                  <Badge
                    className="cursor-pointer"
                    variant={c.tier === "premium" ? "default" : "secondary"}
                    onClick={() => setTierConfirm(c)}
                  >
                    {c.tier === "premium" ? "Premium" : "Gratuit"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Switch checked={c.active !== false} onCheckedChange={() => setActiveConfirm(c)} />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(c)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-[500px] sm:max-w-[500px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editing ? "Modifier la clause" : "Nouvelle clause"}</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label>Titre *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label>Texte juridique complet *</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={8} />
              <p className="text-xs text-muted-foreground">Variables : [MONTANT], [TAUX], [DUREE], [DELAI], [ADRESSE]</p>
            </div>
            <div className="space-y-2">
              <Label>Base légale</Label>
              <Input value={form.base_legale} onChange={(e) => setForm({ ...form, base_legale: e.target.value })} placeholder="Ex : Art. L.313-41 Code conso" />
            </div>
            <div className="space-y-2">
              <Label>Profils concernés</Label>
              <div className="flex flex-wrap gap-2">
                {PROFIL_OPTIONS.map((p) => (
                  <label key={p.value} className="flex items-center gap-1.5 text-sm">
                    <Checkbox checked={form.profils.includes(p.value)} onCheckedChange={() => toggleProfil(p.value)} />
                    {p.label}
                  </label>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Vide = tous les profils</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tier</Label>
                <Select value={form.tier} onValueChange={(v) => setForm({ ...form, tier: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Gratuit</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Ordre d'affichage</Label>
                <Input type="number" value={form.ordre} onChange={(e) => setForm({ ...form, ordre: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.obligatoire} onCheckedChange={(v) => setForm({ ...form, obligatoire: v })} />
              <Label>Obligatoire</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
              <Label>Active</Label>
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setDrawerOpen(false)}>Annuler</Button>
              <Button onClick={handleSave} disabled={!form.title || !form.description || saveMutation.isPending}>
                {saveMutation.isPending ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={() => { setDeleteTarget(null); setDeleteConfirm(""); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Supprimer définitivement cette clause ?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Cette action est irréversible. La clause « {deleteTarget?.title} » sera supprimée.</p>
          <div className="space-y-2">
            <Label>Tapez SUPPRIMER pour confirmer</Label>
            <Input value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Annuler</Button>
            <Button variant="destructive" disabled={deleteConfirm !== "SUPPRIMER"} onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tier toggle confirmation */}
      <Dialog open={!!tierConfirm} onOpenChange={() => setTierConfirm(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Changer le tier</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            Passer cette clause en {tierConfirm?.tier === "free" ? "premium" : "gratuit"} ?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTierConfirm(null)}>Annuler</Button>
            <Button onClick={() => tierConfirm && toggleTier.mutate({ id: tierConfirm.id, tier: tierConfirm.tier === "free" ? "premium" : "free" })}>
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Active toggle confirmation */}
      <Dialog open={!!activeConfirm} onOpenChange={() => setActiveConfirm(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{activeConfirm?.active !== false ? "Désactiver" : "Activer"} cette clause ?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            {activeConfirm?.active !== false
              ? "Elle ne sera plus proposée aux utilisateurs."
              : "Elle sera à nouveau proposée aux utilisateurs."}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveConfirm(null)}>Annuler</Button>
            <Button onClick={() => activeConfirm && toggleActive.mutate({ id: activeConfirm.id, active: activeConfirm.active === false })}>
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
