import { useState } from "react";
import { useBrands, useCreateBrand, useUpdateBrand, useDeleteBrand, uploadImage } from "@/hooks/useSiteContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, ExternalLink, GripVertical, Image } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const BrandsEditor = () => {
  const { data: brands, isLoading } = useBrands();
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();
  const deleteBrand = useDeleteBrand();

  const [newBrand, setNewBrand] = useState({ name: "", website_url: "" });
  const [uploadingNew, setUploadingNew] = useState(false);
  const [newLogoPreview, setNewLogoPreview] = useState<string | null>(null);
  const [newLogoFile, setNewLogoFile] = useState<File | null>(null);

  const handleNewLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBrand = async () => {
    if (!newBrand.name || !newLogoFile) {
      toast.error("Please provide a brand name and logo");
      return;
    }

    setUploadingNew(true);
    try {
      const logoPath = `brands/${Date.now()}-${newLogoFile.name}`;
      const logoUrl = await uploadImage(newLogoFile, logoPath);
      
      const maxOrder = brands?.reduce((max, b) => Math.max(max, b.display_order), 0) || 0;
      
      await createBrand.mutateAsync({
        name: newBrand.name,
        logo_url: logoUrl,
        website_url: newBrand.website_url || null,
        display_order: maxOrder + 1,
      });

      setNewBrand({ name: "", website_url: "" });
      setNewLogoPreview(null);
      setNewLogoFile(null);
      toast.success("Brand added successfully");
    } catch (error) {
      console.error("Error adding brand:", error);
      toast.error("Failed to add brand");
    } finally {
      setUploadingNew(false);
    }
  };

  const handleUpdateBrand = async (id: string, updates: { name?: string; website_url?: string | null; display_order?: number }) => {
    try {
      await updateBrand.mutateAsync({ id, ...updates });
      toast.success("Brand updated");
    } catch (error) {
      console.error("Error updating brand:", error);
      toast.error("Failed to update brand");
    }
  };

  const handleDeleteBrand = async (id: string) => {
    try {
      await deleteBrand.mutateAsync(id);
      toast.success("Brand deleted");
    } catch (error) {
      console.error("Error deleting brand:", error);
      toast.error("Failed to delete brand");
    }
  };

  const handleLogoUpdate = async (id: string, file: File) => {
    try {
      const logoPath = `brands/${Date.now()}-${file.name}`;
      const logoUrl = await uploadImage(file, logoPath);
      await updateBrand.mutateAsync({ id, logo_url: logoUrl });
      toast.success("Logo updated");
    } catch (error) {
      console.error("Error updating logo:", error);
      toast.error("Failed to update logo");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-display font-bold mb-2">Brands</h2>
        <p className="text-muted-foreground font-body">
          Manage the brands you've worked with. Logos will scroll in an infinite marquee.
        </p>
      </div>

      {/* Add New Brand */}
      <div className="bg-secondary/50 rounded-xl p-6 border border-border">
        <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add New Brand
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Logo Upload */}
          <div className="space-y-3">
            <Label>Brand Logo *</Label>
            <div className="flex items-center gap-4">
              <div className="w-32 h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-background">
                {newLogoPreview ? (
                  <img src={newLogoPreview} alt="Preview" className="max-w-full max-h-full object-contain" />
                ) : (
                  <Image className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleNewLogoChange}
                  className="max-w-[200px]"
                />
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, or SVG</p>
              </div>
            </div>
          </div>

          {/* Brand Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-brand-name">Brand Name *</Label>
              <Input
                id="new-brand-name"
                value={newBrand.name}
                onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                placeholder="e.g., Acme Corp"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-brand-url">Website URL (optional)</Label>
              <Input
                id="new-brand-url"
                value={newBrand.website_url}
                onChange={(e) => setNewBrand({ ...newBrand, website_url: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
          </div>
        </div>

        <Button
          onClick={handleAddBrand}
          disabled={uploadingNew || !newBrand.name || !newLogoFile}
          className="mt-6"
        >
          {uploadingNew ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Add Brand
            </>
          )}
        </Button>
      </div>

      {/* Existing Brands */}
      <div className="space-y-4">
        <h3 className="font-display font-semibold">
          Existing Brands ({brands?.length || 0})
        </h3>

        {brands?.length === 0 && (
          <p className="text-muted-foreground font-body py-8 text-center">
            No brands added yet. Add your first brand above!
          </p>
        )}

        <div className="grid gap-4">
          {brands?.map((brand) => (
            <BrandItem
              key={brand.id}
              brand={brand}
              onUpdate={handleUpdateBrand}
              onDelete={handleDeleteBrand}
              onLogoUpdate={handleLogoUpdate}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface BrandItemProps {
  brand: {
    id: string;
    name: string;
    logo_url: string;
    website_url: string | null;
    display_order: number;
  };
  onUpdate: (id: string, updates: { name?: string; website_url?: string | null; display_order?: number }) => void;
  onDelete: (id: string) => void;
  onLogoUpdate: (id: string, file: File) => void;
}

const BrandItem = ({ brand, onUpdate, onDelete, onLogoUpdate }: BrandItemProps) => {
  const [name, setName] = useState(brand.name);
  const [websiteUrl, setWebsiteUrl] = useState(brand.website_url || "");
  const [order, setOrder] = useState(brand.display_order.toString());

  const hasChanges = name !== brand.name || 
    websiteUrl !== (brand.website_url || "") || 
    order !== brand.display_order.toString();

  const handleSave = () => {
    onUpdate(brand.id, {
      name,
      website_url: websiteUrl || null,
      display_order: parseInt(order) || 0,
    });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 flex gap-4 items-start">
      {/* Drag handle (visual only for now) */}
      <div className="flex items-center self-center text-muted-foreground">
        <GripVertical className="w-5 h-5" />
      </div>

      {/* Logo */}
      <div className="relative group">
        <div className="w-24 h-16 rounded-lg border border-border flex items-center justify-center overflow-hidden bg-secondary">
          <img src={brand.logo_url} alt={brand.name} className="max-w-full max-h-full object-contain" />
        </div>
        <label className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg">
          <span className="text-xs font-medium">Change</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onLogoUpdate(brand.id, file);
            }}
          />
        </label>
      </div>

      {/* Details */}
      <div className="flex-1 grid md:grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-9"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Website URL</Label>
          <div className="flex gap-2">
            <Input
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="h-9"
              placeholder="https://"
            />
            {websiteUrl && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-md border border-border hover:bg-secondary transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Display Order</Label>
          <Input
            type="number"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="h-9 w-20"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 self-center">
        {hasChanges && (
          <Button size="sm" onClick={handleSave}>
            Save
          </Button>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Brand</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{brand.name}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(brand.id)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default BrandsEditor;
