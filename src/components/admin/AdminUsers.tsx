"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import { useState } from "react";

interface AdminUsersProps {
  onViewOffers: (userId: string) => void;
}

export function AdminUsers({ onViewOffers }: AdminUsersProps) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [toggleTarget, setToggleTarget] = useState<any>(null);

  const { data: profiles, isLoading } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: roles } = useQuery({
    queryKey: ["admin-user-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: offerCounts } = useQuery({
    queryKey: ["admin-offer-counts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("offers").select("user_id");
      if (error) throw error;
      const counts: Record<string, number> = {};
      data.forEach((o) => { if (o.user_id) counts[o.user_id] = (counts[o.user_id] || 0) + 1; });
      return counts;
    },
  });

  const isAdminUser = (userId: string) => roles?.some((r) => r.user_id === userId && r.role === "admin") || false;

  const toggleAdmin = useMutation({
    mutationFn: async ({ userId, makeAdmin }: { userId: string; makeAdmin: boolean }) => {
      if (makeAdmin) {
        const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
        if (error) throw error;
      } else {
        const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-user-roles"] });
      toast({ title: "Droits mis à jour ✓" });
      setToggleTarget(null);
    },
    onError: (e: any) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Utilisateurs</h2>

      <div className="rounded-md border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Inscription</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-center">Offres</TableHead>
              <TableHead className="text-center">Admin</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Chargement...</TableCell></TableRow>
            ) : profiles?.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="text-xs">{new Date(p.created_at || "").toLocaleDateString("fr-FR")}</TableCell>
                <TableCell className="text-sm font-medium">{p.full_name || "—"}</TableCell>
                <TableCell className="text-sm">{p.email}</TableCell>
                <TableCell className="text-center text-sm">{offerCounts?.[p.id] || 0}</TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={isAdminUser(p.id)}
                    onCheckedChange={() => setToggleTarget(p)}
                  />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => onViewOffers(p.id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!toggleTarget} onOpenChange={() => setToggleTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {toggleTarget && isAdminUser(toggleTarget.id)
                ? `Retirer les droits admin à ${toggleTarget?.full_name || toggleTarget?.email} ?`
                : `Donner les droits admin à ${toggleTarget?.full_name || toggleTarget?.email} ?`}
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToggleTarget(null)}>Annuler</Button>
            <Button onClick={() => toggleTarget && toggleAdmin.mutate({
              userId: toggleTarget.id,
              makeAdmin: !isAdminUser(toggleTarget.id),
            })}>
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
