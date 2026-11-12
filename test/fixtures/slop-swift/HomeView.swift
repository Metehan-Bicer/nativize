import SwiftUI

struct HomeView: View {
    var body: some View {
        VStack {
            Text("✨ Supercharge your day")
                .font(.system(size: 30))
                .dynamicTypeSize(.large)
            Text("Streak").font(.system(size: 14))
            Text("Today").font(.system(size: 14))
            Text("Done").font(.system(size: 14))
            Text("Week").font(.system(size: 12))
            Text("Pro").font(.system(size: 12))
                .textCase(.uppercase)
        }
        .background(LinearGradient(colors: [.purple, .pink], startPoint: .top, endPoint: .bottom))
        .shadow(color: .purple, radius: 20)
        .onTapGesture { }
        .navigationBarBackButtonHidden(true)
    }
}
