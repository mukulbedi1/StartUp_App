import Ping from "@/components/Ping";
import { client } from "@/sanity/lib/client";
import { STARTUP_VIEWS_QUERY } from "@/sanity/lib/queries";
import { writeClient } from "@/sanity/lib/write-client";
import { unstable_after as after } from "next/server";

const View = async ({ id }: { id: string }) => {
  // Fetch the current views from Sanity
  const { views: totalViews } = await client
    .withConfig({ useCdn: false })
    .fetch(STARTUP_VIEWS_QUERY, { id });

  // Deferring the update to the view count using unstable_after
  after(
    async () => {
      // Perform the view count increment after response is sent to the client
      await writeClient
        .patch(id)
        .set({ views: totalViews + 1 })
        .commit();
    }
  );

  return (
    <div className="view-container">
      <div className="absolute -top-2 -right-2">
        <Ping />
      </div>

      <p className="view-text">
        <span className="font-black">Views: {totalViews}</span>
      </p>
    </div>
  );
};

export default View;
