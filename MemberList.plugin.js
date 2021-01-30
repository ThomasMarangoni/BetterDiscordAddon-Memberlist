/*@cc_on
@if (@_jscript)
	
	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
	var pathSelf = WScript.ScriptFullName;
	// Put the user at ease by addressing them in the first person
	shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
	if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
		shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
	} else if (!fs.FolderExists(pathPlugins)) {
		shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
	} else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
		fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
		// Show the user where to put plugins in the future
		shell.Exec("explorer " + pathPlugins);
		shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
	}
	WScript.Quit();

@else@*/

module.exports = (() => {
    const config = {info:{name:"MemberList",authors:[{name:"DasChaos",discord_id:"303646014596972555",github_username:"ThomasMarangoni",twitter_username:"DasChaosAT"}],version:"0.0.2",description:"Allows you to get the Discord Ids of every visble user on the server.",github:"https://github.com/ThomasMarangoni/BetterDiscordAddon-Memberlist/tree/main",github_raw:"https://raw.githubusercontent.com/ThomasMarangoni/BetterDiscordAddon-Memberlist/tree/main/MemberList.plugin.js"},main:"index.js"};

    return !global.ZeresPluginLibrary ? class {
        constructor() {this._config = config;}
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        load() {
            BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                    });
                }
            });
        }
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
    const {Popouts, DiscordModules, DiscordSelectors, DiscordClasses, Utilities, WebpackModules, Patcher, DCM, DOMTools} = Api;

    const from = arr => arr && arr.length > 0 && Object.assign(...arr.map(([k, v]) => ({[k]: v})));
    const filter = (obj, predicate) => from(Object.entries(obj).filter((o) => {return predicate(o[1]);}));

    const GuildStore = DiscordModules.GuildStore;
    //const SelectedGuildStore = DiscordModules.SelectedGuildStore;
    //const PopoutStack = DiscordModules.PopoutStack;
    const GuildMemberStore = DiscordModules.GuildMemberStore;
    const UserStore = DiscordModules.UserStore;

    //const ImageResolver = DiscordModules.ImageResolver;
    //const WrapperClasses = WebpackModules.getByProps("wrapperHover");
    const animate = DOMTools.animate ? DOMTools.animate.bind(DOMTools) : ({timing = _ => _, update, duration}) => {
        const start = performance.now();

        requestAnimationFrame(function renderFrame(time) {
            // timeFraction goes from 0 to 1
            let timeFraction = (time - start) / duration;
            if (timeFraction > 1)
				timeFraction = 1;

            // calculate the current animation state
            const progress = timing(timeFraction);

            update(progress); // draw it

            if (timeFraction < 1)
			{
				requestAnimationFrame(renderFrame);
            }

        });
    };

    const popoutHTML = `<div class="layer-v9HyYc">
<div class="animatorBottom-fS5rNO translate-2dAEQ6 didRender-33z1u8 popout-role-members" style="margin-top: 0;">
    <div class="popoutList-T9CKZQ guildSettingsAuditLogsUserFilterPopout-3Jg5NE elevationBorderHigh-2WYJ09 role-members-popout">
        <div class="popoutListInput-1l9TUI size14-3iUx6q container-cMG81i small-2oHLgT">
            <div class="inner-2P4tQO"><input class="input-3Xdcic" placeholder="Search Members — {{memberCount}}" value="">
                <div tabindex="0" class="iconLayout-3OgqU3 small-2oHLgT" role="button">
                    <div class="iconContainer-2wXvy1">
                        <svg name="Search" class="icon-1S6UIr visible-3bFCH-" width="18" height="18" viewBox="0 0 18 18"><g fill="none" fill-rule="evenodd"><path fill="currentColor" d="M3.60091481,7.20297313 C3.60091481,5.20983419 5.20983419,3.60091481 7.20297313,3.60091481 C9.19611206,3.60091481 10.8050314,5.20983419 10.8050314,7.20297313 C10.8050314,9.19611206 9.19611206,10.8050314 7.20297313,10.8050314 C5.20983419,10.8050314 3.60091481,9.19611206 3.60091481,7.20297313 Z M12.0057176,10.8050314 L11.3733562,10.8050314 L11.1492281,10.5889079 C11.9336764,9.67638651 12.4059463,8.49170955 12.4059463,7.20297313 C12.4059463,4.32933105 10.0766152,2 7.20297313,2 C4.32933105,2 2,4.32933105 2,7.20297313 C2,10.0766152 4.32933105,12.4059463 7.20297313,12.4059463 C8.49170955,12.4059463 9.67638651,11.9336764 10.5889079,11.1492281 L10.8050314,11.3733562 L10.8050314,12.0057176 L14.8073185,16 L16,14.8073185 L12.2102538,11.0099776 L12.0057176,10.8050314 Z"></path></g></svg>
                        <svg name="Close" class="clear--Eywng icon-1S6UIr" width="12" height="12" viewBox="0 0 12 12"><g fill="none" fill-rule="evenodd"><path d="M0 0h12v12H0"></path><path class="fill" fill="currentColor" d="M9.5 3.205L8.795 2.5 6 5.295 3.205 2.5l-.705.705L5.295 6 2.5 8.795l.705.705L6 6.705 8.795 9.5l.705-.705L6.705 6"></path></g></svg>
                    </div>
                </div>
            </div>
        </div>
        <div class="divider-3573oO divider-faSUbd marginTop8-1DLZ1n marginBottom8-AtZOdT"></div>
        <div class="scroller-2CvAgC thin-1ybCId scrollerBase-289Jih role-members" dir="ltr" style="overflow: hidden scroll; padding-right: 0px; max-height: 400px;">
            
        </div>
    </div>
</div>
</div>`;

    return class MemberList extends Plugin {

        onStart() {
            this.patchGuildContextMenu();
        }

        onStop() {
            const elements = document.querySelectorAll(".popout-role-members");
            for (const el of elements) el && el.remove();
            Patcher.unpatchAll();
        }

        patchGuildContextMenu() {
            const GuildContextMenu = WebpackModules.getModule(m => m.default && m.default.displayName == "GuildContextMenu");
            Patcher.after(GuildContextMenu, "default", (_, args, retVal) => {
				const props = args[0];
                const guildId = props.guild.id;
                const roles = props.guild.roles;
                const roleItems = [];

				const item = DCM.buildMenuItem({
					id: 0,
					label: "Copy User IDs to Clipboard",
					closeOnClick: false,
					action: (e) => {
						this.showNavigationPopout(e.target.closest(DiscordSelectors.ContextMenu.item), guildId);
					}
				});
				roleItems.push(item);

                const original = retVal.props.children[0].props.children;
                const newOne = DCM.buildMenuItem({type: "submenu", label: "MemberList", children: roleItems});
                if (Array.isArray(original))
					original.splice(1, 0, newOne);
                else
					retVal.props.children[0].props.children = [original, newOne];       
            });
        }

        showNavigationPopout(target, guildId) {
            let members = GuildMemberStore.getMembers(guildId);
            let outString = "";
			
			for (let i = 0; i < members.length; i++) {
				outString += members[i].userId + "\n";
			}
			
			navigator.clipboard.writeText(outString);
			
			console.log("test");
			console.log(JSON.stringify(UserStore));
        }

    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
