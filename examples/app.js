import {Manager,GSLT} from '../index.mjs'

const main = async () => {
	// Initialize Manager with Your Steam Web API Key(https://steamcommunity.com/dev/apikey)
	const manager = await new Manager("YOUR_Steam_Web_API_Key")

	// Generate GSLT with appid 730(CS:GO) and Memo("WASD")
	let gslt = await manager.Generate(730,"WASD")
	console.log(gslt)

	// Manage your GSLT...

	// Resets login_token
	// gslt.ResetLoginToken()

	// Sets memo
	gslt.SetMemo("WASD_")

	// Delete
	gslt.Delete()

	// Refresh GSLT list
	await manager.RefreshList()
	console.log(manager.gslts)

	// Resets first GSLT's login_token...
	manager.gslts[0].ResetLoginToken()

	// Let's see if its changed
	await manager.RefreshList()
	console.log(manager.gslts)
}

main()