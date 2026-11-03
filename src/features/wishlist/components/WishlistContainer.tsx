"use client";

import { useMemo, useState } from "react";
import { useCartDrawer } from "@/features/cart/context";
import type { Product, ProductVariant } from "@/types";
import {
  useRemoveWishlistProduct,
  useWishlist,
  useWishlistProducts,
} from "../hooks";
import {
  filterAndSortWishlistProducts,
  type WishlistCategory,
  type WishlistSort,
} from "../lib/wishlistFilters";
import {
  buildWishlistCartLine,
  getDefaultVariant,
  getWishlistProductIds,
} from "../lib/wishlistProduct";
import { WishlistPresenter } from "./WishlistPresenter";

type WishlistContainerProps = {
  userId: string;
};

export function WishlistContainer({ userId }: WishlistContainerProps) {
  const [category, setCategory] = useState<WishlistCategory>("all");
  const [sort, setSort] = useState<WishlistSort>("featured");
  const { addLine, isUpdating } = useCartDrawer();

  const {
    data: wishlists = [],
    isLoading,
    isError,
    refetch,
  } = useWishlist(userId);
  const wishlist = wishlists[0];
  const productIds = useMemo(
    () => getWishlistProductIds(wishlist),
    [wishlist],
  );

  const {
    data: products = [],
    isLoading: isLoadingProducts,
    isError: isProductsError,
    refetch: refetchProducts,
  } = useWishlistProducts(productIds);

  const removeMutation = useRemoveWishlistProduct(userId);

  const visibleProducts = useMemo(
    () => filterAndSortWishlistProducts(products, category, sort),
    [products, category, sort],
  );

  const handleRemove = (productId: string) => {
    if (!wishlist) {
      return;
    }

    removeMutation.mutate({
      wishlistId: wishlist.id,
      productId,
      productIds: productIds.filter((id) => id !== productId),
    });
  };

  const handleAddToCart = (product: Product, variant: ProductVariant) => {
    const line = buildWishlistCartLine(product, variant);

    if (line) {
      void addLine(line);
    }
  };

  const handleAddAll = async () => {
    for (const product of products) {
      const variant = getDefaultVariant(product);

      if (!variant || variant.stock <= 0) {
        continue;
      }

      const line = buildWishlistCartLine(product, variant);

      if (line) {
        await addLine(line);
      }
    }
  };

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "قائمة رغباتي - SHEORA",
          text: "اكتشفي منتجات SHEORA المفضلة لديّ",
          url,
        });
        return;
      } catch {
        // Fall back to copying the link when sharing is cancelled/unavailable.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard access can be blocked; the button simply provides no toast.
    }
  };

  const handleRetry = () => {
    void refetch();
    void refetchProducts();
  };

  return (
    <WishlistPresenter
      products={products}
      visibleProducts={visibleProducts}
      isLoading={isLoading || (productIds.length > 0 && isLoadingProducts)}
      isError={isError || isProductsError}
      onRetry={handleRetry}
      category={category}
      onCategoryChange={setCategory}
      sort={sort}
      onSortChange={setSort}
      onRemove={handleRemove}
      removingProductId={
        removeMutation.isPending
          ? (removeMutation.variables?.productId ?? null)
          : null
      }
      onAddToCart={handleAddToCart}
      isAdding={isUpdating}
      onAddAll={() => void handleAddAll()}
      onShare={handleShare}
    />
  );
}
