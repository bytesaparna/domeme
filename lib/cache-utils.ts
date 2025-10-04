import { revalidateTag } from 'next/cache';

/**
 * Invalidate trending domains cache
 * Call this when you want to force refresh of trending domains data
 */
export async function invalidateTrendingDomainsCache() {
  try {
    await revalidateTag('trending-domains');
    console.log('✅ Trending domains cache invalidated');
  } catch (error) {
    console.error('❌ Error invalidating trending domains cache:', error);
  }
}

/**
 * Invalidate all caches related to domains
 */
export async function invalidateAllDomainCaches() {
  try {
    await revalidateTag('trending-domains');
    await revalidateTag('domain-traits');
    await revalidateTag('domain-search');
    console.log('✅ All domain caches invalidated');
  } catch (error) {
    console.error('❌ Error invalidating domain caches:', error);
  }
}
