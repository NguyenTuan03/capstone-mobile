import { useEffect } from "react";
import { router } from "expo-router";

export default function CommunityIndex() {
  useEffect(() => {
    router.replace("/menu/community/partner");
  }, []);
  return null;
}
